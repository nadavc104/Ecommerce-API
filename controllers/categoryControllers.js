import asyncHandler from 'express-async-handler'
import Category from '../models/Category.js'
import User from '../models/User.js'
// @desc create category
// @route POST /categories
// @access Private

const createCategory = asyncHandler(async (req, res) => {

    const { name, description, parent } = req.body
    const { path: image } = req.file
    let parentPath = ''
    console.log('req.roles is', req.roles)

    const user = await User.findOne({username: req.user}).exec()

    if(!user)
        return res.status(400).json({ message: 'invalid User' })
    if(parent) {
        const parentCategory = await Category.findById(parent).exec()
        if(!parentCategory)
            return res.status(400).json({message: 'Invalid parent category id'})

        parentPath = `${parentCategory.path}/`
    }

    const category = await Category.create({
        name,
        description,
        image: image.replaceAll('\\','/'),
        parent: parent ? parent : null,
        path: parentPath ? `${parentPath}${name}` : name,
        user: user._id
    })

    if(category && parentPath) {
        const parentCategory = await Category.findById(parent).exec()
        parentCategory.children = [...parentCategory.children, category._id ]
        await parentCategory.save()
    }

    if(category) {
        res.status(201).json({ message: `New category ${name} was created` })
    } else {
        res.status(400).json({ message: 'Invalid category data' })
    }
})
// @desc get categories
// @route GET /categories
// @access Private

const getCategories = asyncHandler(async (req, res) => {
    const categories = await Category.find().lean()
    if(!categories?.length)
        return res.status(400).json({ message: 'No categories found'})

    res.json(categories)
})

// @desc update category
// @route PATCH /categories/:id
// @access Private

const updateCategory = asyncHandler(async (req, res) => {

    const { name, description } = req.body
    const { id } = req.params

    const category = await Category.findById(id).exec()
    if(!category)
        return res.status(400).json({ message: 'Category does not exists' })

    if(category.name === name && category.description === description && category.image === image)
        return res.status(400).json({ message: 'Change the fields to update the Category' })

    category.name = name,
    category.description = description

    const updatedCategory = await category.save()

    res.status(200).json({ message: `Category ${updatedCategory.name} updated successfully` })
})

const deleteCategory = asyncHandler(async (req, res) => {

    const { id } = req.params

    const category = await Category.findById(id).exec()

    if(!category)
        return res.status(400).json({ message: 'Category not found' })

    const deletedCategory = await category.deleteOne()

    const updateChildPaths = async (parentId, parentPath) => {
        const children = await Category.find({ parent: parentId }).exec()
        for (let i = 0; i < children.length; i++) {
          const child = children[i];
          const newPath = parentPath ? `${parentPath}/${child.name}` : child.name
          await Category.updateOne({ _id: child._id }, { path: newPath }).exec()
          await updateChildPaths(child._id, newPath);
        }
      };

      const deletedParentPath = await Category.findById(deletedCategory.parent).exec()
      const parentPathExists = deletedParentPath ? deletedParentPath.name : ''
      await updateChildPaths(deletedCategory._id, parentPathExists)

    if(deletedCategory?.children) {
        await Category.updateMany({parent: deletedCategory._id }, {$set: {parent: deletedCategory.parent}})
    }

    if(deletedCategory?.parent) {
        await Category.updateOne({_id: deletedCategory.parent}, {$pull: { children: deletedCategory._id }}).exec()
        await Category.updateOne({_id: deletedCategory.parent}, {$push: { children: {$each: deletedCategory.children}}}).exec()
    }

    res.status(200).json({ message: `${deletedCategory.name} was deleted successfully` })
})

export { createCategory, getCategories, updateCategory, deleteCategory }
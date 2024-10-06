import { Router } from 'express'
import { uploader } from '../utils.js'
import ProductManager from '../services/ProductManager.js'

const router = Router()

const prodManager = new ProductManager()

router.get('/', async (req, res) => {
    try {
        const limit = parseInt(req.query.limit)
        const products = await prodManager.getProducts(limit)
        res.send(products)
    } catch (err) {
        console.log(`Error ${err}`)
    }
})

router.get('/:pid', async (req, res) => {
    try {
        const prodId = parseInt(req.params.pid)
        const product = await prodManager.getProduct(prodId)

        product && res.send(product)
        !product && res.status(404).send({ status: 'error', error: 'product not found' })
    } catch (err) {
        console.log(`Error ${err}`)
    }
})

router.post('/', uploader.single('img'), async (req, res) => {

    try {
        const { title, description, code, price, stock, category } = req.body

        const img = req.file

        if (!title || !description || !code || !price || !stock || !category || !img) {
            return res.status(400).send({ status: 'error', error: 'incomplete data' })
        } else {

            const prodAdded = prodManager.setProduct({ title, description, code, price, stock, category }, img)
            res.send(prodAdded)
        }
    } catch (err) {
        console.log(`Error: ${err}`)
    }

})

router.put('/:pid', uploader.single('img'), async (req, res) => {
    
    try {
        const productId = parseInt(req.params.pid)
        const img = req.file
        const modifiedProduct = req.body
        const newProduct = prodManager.editProduct(productId, modifiedProduct, img)

        newProduct && res.send(newProduct)
        !newProduct && res.send({error: 'product not found'})
    } catch(err) {
        console.log(`Error: ${err}`)
    }

})

router.delete('/:pid', async (req, res) => {

    try {
        const prodId = parseInt(req.params.pid)
        const deletedProd = prodManager.deleteProduct(prodId)

        deletedProd && res.send(deletedProd)
        !deletedProd && res.status(400).send({error: `product not found`})
    } catch(err) {
        console.log(`Error: ${err}`)
    }

})

export default router
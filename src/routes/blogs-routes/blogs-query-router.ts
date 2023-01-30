import {Request, Response, Router} from "express";
import {blogsType, findBlogsType, findPostsType} from "../../repositories/types/types";
import {sendStatus} from "../../repositories/status-collection";
import {ObjectId} from "mongodb";
import {blogsQueryRepository} from "../../repositories/blogs-repositories/blogs-query-repository";

export const blogsQueryRouter = Router()

blogsQueryRouter.get('/', async (req: Request, res: Response) => {
    const searchNameTerm = req.query.searchNameTerm
    const sortBy = req.query.sortBy
    const sortDirection = req.query.sortDirection
    const pageNumber = +(req.query.pageNumber ?? 1)
    const pageSize = +(req.query.pageSize ?? 10)
    const allBlogs: findBlogsType = await blogsQueryRepository
        .findAllBlogs(searchNameTerm as string, sortBy as string, sortDirection as string, pageNumber, pageSize)
    res.status(sendStatus.OK_200).send(allBlogs)
})

blogsQueryRouter.get('/:id', async (req: Request, res: Response) => {
    let blogId: ObjectId;
    try {
        blogId = new ObjectId(req.params.id)
    } catch (e) {
        res.sendStatus(sendStatus.NOT_FOUND_404)
        return false
    }

    const foundBlog: blogsType | null = await blogsQueryRepository.findBlogById(blogId)
    if (!foundBlog) {
        res.sendStatus(sendStatus.NOT_FOUND_404)
        return
    }

    res.status(sendStatus.OK_200).send(foundBlog)

})

blogsQueryRouter.get('/:id/posts', async (req: Request, res: Response) => {
    const sortBy = req.query.sortBy
    const sortDirection = req.query.sortDirection
    const pageNumber = +(req.query.pageNumber ?? 1)
    const pageSize = +(req.query.pageSize ?? 10)
    let blogId: string;
    try {
        blogId = new ObjectId(req.params.id).toString()
    } catch (e) {
        res.sendStatus(sendStatus.NOT_FOUND_404)
        return false
    }
    const foundBlogById: blogsType | null = await blogsQueryRepository.findBlogById(new ObjectId(blogId))
    if (!foundBlogById) {
        res.sendStatus(sendStatus.NOT_FOUND_404)
        return
    }
    const allPostsByBlogId: findPostsType | null = await blogsQueryRepository
        .findAllPostsByBlogId(sortBy as string, sortDirection as string, pageNumber, pageSize, blogId)

    res.status(sendStatus.OK_200).send(allPostsByBlogId)
})


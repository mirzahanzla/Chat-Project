import express from 'express';
import {
    createBlog,
    getAllUserBlogs,
    getPaginatedBlogs,
    toggleLikePost,
    toggleSavePost,
    getSavedPosts,
    getComments,
    addComment,
    updateBlog,
    deleteBlog, 
    monitorReachCount,
    minitorVisitCount} from '../controllers/blogController.js';
import multer from 'multer';

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.put('/updateBlog/:postId', upload.single('blogMainImg'),  updateBlog);
router.post('/addBlog', upload.single('blogMainImg'),  createBlog);
router.get('/blogs', getAllUserBlogs);
router.get('/blog', getAllUserBlogs);
router.get('/allBlogs', getPaginatedBlogs);
router.post('/likePost', toggleLikePost)
router.post('/savePost', toggleSavePost);
router.get('/savedBlogs', getSavedPosts);
router.get('/getComments/:postId', getComments);
router.post('/addComment/:postId', addComment);
router.delete('/deletePost/:postId', deleteBlog);
router.put('/addReachCount', monitorReachCount);
router.put('/minitorVisitCount', minitorVisitCount);

export default router;
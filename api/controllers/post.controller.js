import jwt from "jsonwebtoken";
import prisma from "../lib/prisma.js";

// Get all posts
export const getPosts = async (req, res) => {
  const query = req.query;

  try {
    const posts = await prisma.post.findMany({
      where: {
        city: query.city || undefined,
        type: query.type || undefined,
        farmType: query.farmType || undefined,
        quantity: parseInt(query.quantity) || undefined,
        price: {
          gte: parseInt(query.minPrice) || 0,
          lte: parseInt(query.maxPrice) || 1000000,
        },
      },
    });

    res.status(200).json(posts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to get posts" });
  }
};

// Get a single post by id
export const getPost = async (req, res) => {
  const id = req.params.id;
  try {
    // First, get the post without including the user
    const post = await prisma.post.findUnique({
      where: { id },
      include: {
        postDetail: true,
      },
    });

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    // Then, try to get the user separately
    let userData = null;
    try {
      const user = await prisma.user.findUnique({
        where: { id: post.userId },
        select: {
          username: true,
          avatar: true,
        },
      });
      userData = user;
    } catch (userErr) {
      console.log("Error fetching user:", userErr);
      // If user doesn't exist, use default values
      userData = {
        username: "Deleted User",
        avatar: "/noavatar.jpg",
      };
    }

    // Combine the post with the user data
    const postWithUser = {
      ...post,
      user: userData,
    };

    const token = req.cookies?.token;

    if (token) {
      jwt.verify(token, process.env.JWT_SECRET_KEY, async (err, payload) => {
        if (err) {
          return res.status(200).json({ ...postWithUser, isSaved: false });
        }

        const saved = await prisma.savedPost.findUnique({
          where: {
            userId_postId: {
              postId: id,
              userId: payload.id,
            },
          },
        });

        return res
          .status(200)
          .json({ ...postWithUser, isSaved: saved ? true : false });
      });
    } else {
      return res.status(200).json({ ...postWithUser, isSaved: false });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Failed to get post" });
  }
};

// Add a new post
export const addPost = async (req, res) => {
  const body = req.body;
  const tokenUserId = req.userId;

  try {
    const newPost = await prisma.post.create({
      data: {
        ...body.postData,
        userId: tokenUserId,
        postDetail: {
          create: body.postDetail,
        },
      },
    });

    res.status(200).json(newPost);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to create post" });
  }
};

// Update a post by id
export const updatePost = async (req, res) => {
  try {
    res.status(200).json({ message: "" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to get posts" });
  }
};

// Delete a post by id
export const deletePost = async (req, res) => {
  const id = req.params.id;
  const tokenUserId = req.userId;

  try {
    // Check if the post exists
    const post = await prisma.post.findUnique({
      where: { id },
    });
    // Check if the user is the owner of the post
    if (post.userId !== tokenUserId) {
      return res.status(403).json({ message: "You are not authorized" });
    }
    // Delete the post
    await prisma.post.delete({
      where: { id },
    });

    res.status(200).json({ message: "Post deleted" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to delete post" });
  }
};

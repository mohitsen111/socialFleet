import { db } from "../connect.js";
import jwt from "jsonwebtoken";
import moment from "moment";

export const getPosts = (req, res) => {
  const userId = req.query.userId;
  const authHeaders = req.headers.authorization;
  const token = authHeaders.split(" ")[1];
  if (!token) {
    console.log("To get posts, you need to provide userId and accessToken");
    console.log(`You have userId = ${userId} and token = ${token}`);
    return res.status(401).json("Not logged in!");
  }

  jwt.verify(token, "secretkey", (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid!");

    const q = `
    SELECT DISTINCT p.*, u.id AS userId, name, profilePic
    FROM posts AS p
    JOIN users AS u ON u.id = p.userId
    LEFT JOIN relationships AS r ON (p.userId = r.followedUserId OR p.userId = r.followerUserId)
    WHERE p.userId = ? OR r.followerUserId = ?
    ORDER BY p.createdAt DESC
    
    `;

    const values = [userId, userId];

    db.query(q, values, (err, results) => {
      if (err) {
        console.error("Error fetching posts:", err);
        return res.status(500).json(err);
      }
      console.log(results);
      return res.status(200).json(results);
    });
  });
};


export const addPost = (req, res) => {
  const authHeaders = req.headers.authorization;
  const token = authHeaders.split(" ")[1];
    if (!token) return res.status(401).json("Not logged in!");

  jwt.verify(token, "secretkey", (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid!");

    const q =
      "INSERT INTO posts (`desc`, `img`, `createdAt`, `userId`) VALUES (?, ?, ?, ?)";
    const values = [
      req.body.desc,
      req.body.img,
      moment(Date.now()).format("YYYY-MM-DD HH:mm:ss"),
      userInfo.id,
    ];

    db.query(q, values, (err, data) => {
      if (err) {
        console.error("Error adding post:", err);
        return res.status(500).json(err);
      }
      return res.status(200).json("Post has been created.");
    });
  });
};

export const deletePost = (req, res) => {
  const authHeaders = req.headers.authorization;
  const token = authHeaders.split(" ")[1];
    if (!token){
    console.log("no accessToken, give token in Header by cookies");
    return res.status(401).json("Not logged in!");
  }

  jwt.verify(token, "secretkey", (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid!");

    const q = "DELETE FROM posts WHERE `id` = ? AND `userId` = ?";

    db.query(q, [req.params.id, userInfo.id], (err, data) => {
      if (err) {
        console.error("Error deleting post:", err);
        return res.status(500).json(err);
      }
      if (data.affectedRows > 0) return res.status(200).json("Post has been deleted.");
      return res.status(403).json("You can delete only your post.");
    });
  });
};

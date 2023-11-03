import { db } from "../connect.js";
import jwt from "jsonwebtoken";

export const getRelationships = (req, res) => {
  const q = "SELECT followerUserId FROM relationships WHERE followedUserId = ?";

  db.query(q, [req.query.followedUserId], (err, results) => {
    if (err) {
      console.error("Error fetching relationships:", err);
      return res.status(500).json(err);
    }
    return res.status(200).json(results.map(relationship => relationship.followerUserId));
  });
};

export const addRelationship = (req, res) => {
  const authHeaders = req.headers.authorization;
  const token = authHeaders.split(" ")[1];
    if (!token) return res.status(401).json("Not logged in!");

  jwt.verify(token, "secretkey", (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid!");

    const q = "INSERT INTO relationships (`followerUserId`, `followedUserId`) VALUES (?, ?)";
    const values = [userInfo.id, req.body.userId];

    db.query(q, values, (err, data) => {
      if (err) {
        console.error("Error adding relationship:", err);
        return res.status(500).json(err);
      }
      return res.status(200).json("Following");
    });
  });
};

export const deleteRelationship = (req, res) => {
  const authHeaders = req.headers.authorization;
  const token = authHeaders.split(" ")[1];
  if (!token) return res.status(401).json("Not logged in!");

  jwt.verify(token, "secretkey", (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid!");

    const followerUserId = userInfo.id;
    const followedUserId = req.query.userId;

    // Check if the relationship exists before attempting to delete it
    const checkQuery = "SELECT * FROM relationships WHERE `followerUserId` = ? AND `followedUserId` = ?";
    db.query(checkQuery, [followerUserId, followedUserId], (checkErr, checkResults) => {
      if (checkErr) {
        console.error("Error checking relationship:", checkErr);
        return res.status(500).json(checkErr);
      }

      if (checkResults.length === 0) {
        return res.status(400).json("Relationship does not exist or user Alredy unfollow this user so , cannot unfollow.");
      }

      // If the relationship exists, proceed to delete it
      const deleteQuery = "DELETE FROM relationships WHERE `followerUserId` = ? AND `followedUserId` = ?";
      db.query(deleteQuery, [followerUserId, followedUserId], (deleteErr, deleteResults) => {
        if (deleteErr) {
          console.error("Error deleting relationship:", deleteErr);
          return res.status(500).json(deleteErr);
        }
        return res.status(200).json("Unfollowed successfully.");
      });
    });
  });
};


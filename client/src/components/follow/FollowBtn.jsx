import React, { useContext } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AuthContext } from "../../context/authContext";
import useMakeRequest from "../../hook/useFetch";

const FollowBtn = ({ userId, relationshipData, isSearch = false }) => {
  const queryClient = useQueryClient();
  const { currentUser } = useContext(AuthContext);
  const makeRequest = useMakeRequest();
  const mutation = useMutation(
    (following) => {
      if (following)
        return makeRequest.delete("/relationships?userId=" + userId);
      return makeRequest.post("/relationships", { userId });
    },
    {
      onSuccess: () => {
        // Invalidate and refetch
        queryClient.invalidateQueries(["relationship"]);
      },
    }
  );

  console.log(relationshipData);
  console.log(userId);
  console.log(relationshipData.includes(userId));
  const followerId = !isSearch ? currentUser.id : userId;
  const handleFollow = (e) => {
    e.stopPropagation();
    e.preventDefault();
    mutation.mutate(relationshipData.includes(followerId));
  };

  return (
    <button
      onClick={handleFollow}
      disabled={isSearch}
      style={{ cursor: isSearch ? "not-allowed" : "pointer" }}
    >
      {relationshipData.includes(followerId) ? "Following" : "Follow"}
    </button>
  );
};

export default FollowBtn;

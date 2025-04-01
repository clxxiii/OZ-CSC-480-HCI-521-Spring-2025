import React from "react";
import Tag from "./Tag";

const QuoteTags = ({ tags }) => {
  return (
    <div style={{ display: "flex", gap: "2px", flexWrap: "wrap" }}>
      {tags?.map((tag, index) => (
        <Tag text={tag} key={index} />
      ))}
    </div>
  );
};

export default QuoteTags;

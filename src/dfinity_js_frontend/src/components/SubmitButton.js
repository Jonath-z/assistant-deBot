import React from "react";
import Loading from "./Loading";

const SubmitButton = ({ onClick, loading }) => {
  return (
    <button
      type="submit"
      className="submit-button"
      disable={loading}
      onClick={onClick}
    >
      {!loading && "Vectorize"}
      {loading && <Loading />}
    </button>
  );
};

export default SubmitButton;

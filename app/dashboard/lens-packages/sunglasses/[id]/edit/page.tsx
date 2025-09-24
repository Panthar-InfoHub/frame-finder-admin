import React from "react";

const page = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;
  return <div>add sunglasses edit form later for {id}</div>;
};

export default page;

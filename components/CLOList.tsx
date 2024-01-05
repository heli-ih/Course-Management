"use client";
import React, { ReactNode, useState } from "react";

interface CLOListProps {
  children: ReactNode;
}

const CLOList: React.FC<CLOListProps> = ({ children }) => {
  return <div>{children}</div>;
};

export default CLOList;

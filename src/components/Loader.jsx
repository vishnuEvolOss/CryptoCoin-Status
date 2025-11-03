import React from 'react';
import { Spin } from 'antd';

const Loader = () => (
  <div className="flex items-center justify-center min-h-[80vh]">
    <div className="text-center">
      <Spin size="large" />
      <p className="mt-4 text-gray-600">Loading...</p>
    </div>
  </div>
);

export default Loader;

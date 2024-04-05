import React from 'react';
import { Button, Result } from 'antd';

const PageNotFound = () => {
  
  const goBack = () => {
    // Go back to the previous page in the history
    window.history.back();
  };

  return (
    <Result
      status="404"
      title="404"
      subTitle="Sorry, the page you visited does not exist."
      extra={<Button type="primary" onClick={goBack}>Go Back</Button>}
    />
  );
};

export default PageNotFound;

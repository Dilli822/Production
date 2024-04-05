

// import { Layout, Button, theme, List, AutoComplete, Input } from "antd";
// import "../../../../forbidden.css"
// export default function UnathorizedAccess(){
//     return(
//         <>
// <div class="message">You are not authorized.
//   </div>
//   <div class="message2">You tried to access a page you did not have prior authorization for.
//   <br></br>
//   </div>
  
//   <div class="container">
//     <div class="neon">403</div>
//     <div class="door-frame">
//       <div class="door">
//         <div class="rectangle">
//       </div>
//         <div class="handle">
//           </div>
//         <div class="window">
//           <div class="eye">
//           </div>
//           <div class="eye eye2">
//           </div>
//           <div class="leaf">
//           </div> 
//         </div>
//       </div>  
//     </div>
//   </div>
//         </>
//     )
// }


import React from 'react';
import { Result, Button } from 'antd';

const Forbidden = () => {
  return (
    <Result
      status="403"
      title="403 Forbidden"
      subTitle="Sorry, you are not authorized to access this page. You must have an account! Login/Signup Now"
      extra={
        <Button type="primary" href="/">
          Back Home
        </Button>
      }
    />
  );
};

export default Forbidden;

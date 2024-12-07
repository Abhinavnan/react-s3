import React, { useState } from "react";
import { Amplify} from "aws-amplify";
import awsExports from "./aws-exports";
import { createBucket, uploadFile } from "./services/s3Service";
//import * as Amplify from 'aws-amplify';
const { Auth } = Amplify;

Amplify.configure(awsExports);

const App = () => {
  const [user, setUser] = useState(null);
  const [file, setFile] = useState(null);

  const signIn = async () => {
    try {
      const user = await Auth.signIn("username", "password");
      setUser(user);
      console.log('Signed in user:', user);
      const bucketName = `user-storage-${user.username}`;
      await createBucket(bucketName);
    } catch (err) {
      console.error("Error signing in:", err);
    }
  };

  const handleUpload = async () => {
    if (!file || !user) return;
    const bucketName = `user-storage-${user.username}`;
    await uploadFile(bucketName, file);
  };

  return (
    <div>
      <h1>Cloud Storage App</h1>
      {!user ? (
        <button onClick={signIn}>Sign In</button>
      ) : (
        <>
          <input type="file" onChange={(e) => setFile(e.target.files[0])} />
          <button onClick={handleUpload}>Upload File</button>
        </>
      )}
    </div>
  );
};

export default App;

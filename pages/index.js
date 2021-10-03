import styles from '../styles/Home.module.css';
import { Helmet } from 'react-helmet';
import { useState } from 'react';
import { withPageAuthRequired } from '@auth0/nextjs-auth0';

export default function Home({ user }) {
  const [id, setId] = useState(null);
  const [editing, setEditing] = useState(false);

  const openUpload = () => {
    window.cloudinary
      .createUploadWidget(
        {
          cloudName: 'dtgbzmpca',
          uploadPreset: 'tca2j0ee',
        },
        (error, result) => {
          if (!error && result && result.event === 'success') {
            setId(result.info.public_id);
            setEditing(true);
          }
        }
      )
      .open();
  };

  const openEditor = () => {
    const myEditor = cloudinary.mediaEditor();
    myEditor.update({
      publicIds: [id],
      cloudName: 'dtgbzmpca',
      image: {
        steps: ['resizeAndCrop', 'textOverlays', 'export'],
      },
    });

    myEditor.show();
    myEditor.on('export', function (data) {
      console.log(data);
      setEditing(false);
    });
  };

  return (
    <div>
      <Helmet>
        <script src='https://media-editor.cloudinary.com/all.js' />
        <script src='https://upload-widget.cloudinary.com/global/all.js' />
      </Helmet>
      <main className={styles.files}>
        <header className={styles.header}>
          <a href='/api/auth/logout' className={styles.logout}>
            Log Out
          </a>
        </header>
        <p className={styles.name}>Hi {user.name}</p>
        <div className={styles.container}>
          <div className={styles.buttonwrapper}>
            {!editing && (
              <button className={styles.button} onClick={() => openUpload()}>
                Upload Image
              </button>
            )}
            {editing && (
              <>
                <p>Image uploaded successfully!</p>

                <button className={styles.button} onClick={() => openEditor()}>
                  Open Editor
                </button>
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export const getServerSideProps = withPageAuthRequired({
  returnTo: '/',
});

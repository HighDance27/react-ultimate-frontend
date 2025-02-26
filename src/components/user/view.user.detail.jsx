import { useState } from "react";
import { Button, Drawer, notification } from "antd";
import { handleUploadFile, updateUserAvatarAPI } from "../../services/api.service";

const ViewUserDetail = (props) => {
    const {
        dataDetail, setDataDetail,
        isDetailOpen, setIsDetailOpen, loadUser } = props;

    const [selectedFile, setSelectedFile] = useState(null);
    const [preview, setPreview] = useState(null);

    const handleOnChangeFile = (event) => {
        if (!event.target.files || event.target.files === 0) {
            setSelectedFile(null);
            setPreview(null);
            return;
        }
        const file = event.target.files[0];
        if (file) {
            setSelectedFile(file);
            setPreview(URL.createObjectURL(file))
        }
    }
    const handleUpdateUserAvatar = async () => {
        const resUpload = await handleUploadFile(selectedFile, "avatar");
        if (resUpload.data) {
            const newAvatar = resUpload.data.fileUploaded;
            const resUpdateAvatar = await updateUserAvatarAPI(newAvatar, dataDetail._id, dataDetail.fullName, dataDetail.phone);

            if (resUpdateAvatar.data) {
                setIsDetailOpen(false);
                setSelectedFile(null);
                setPreview(null);
                await loadUser();

                notification.success({
                    message: "Update User Avatar",
                    description: "Cap nhat avatar thanh cong"
                })
            } else {
                notification.error({
                    message: "Error Upload Avatar",
                    description: JSON.stringify(resUpdateAvatar.message)
                })
            }
        }
        else {
            notification.error({
                message: "Error Upload Avatar",
                description: JSON.stringify(resUpload.message)
            })
        }
    }


    return (
        <Drawer
            width={"40vw"}
            title="User Detail"
            onClose={() => {
                setDataDetail(null);
                setIsDetailOpen(false);
            }}
            open={isDetailOpen}
        >
            {dataDetail ?
                <>
                    <p><span style={{ fontWeight: "bold" }}>Id:</span>
                        {dataDetail._id}</p> <br />
                    <p><span style={{ fontWeight: "bold" }}>Full Name:</span>
                        {dataDetail.fullName}</p> <br />
                    <p><span style={{ fontWeight: "bold" }}>Email:</span>
                        {dataDetail.email}</p> <br />
                    <p><span style={{ fontWeight: "bold" }}>Phone Number:</span>
                        {dataDetail.phone}</p> <br />
                    <p>Avatar:</p>
                    <div style={{
                        marginTop: '10px',
                        height: '100px', width: '150px',
                        border: '1px solid #ccc'
                    }}>
                        <img style={{
                            height: '100%', width: '100%',
                            objectFit: 'contain'
                        }}
                            src={`${import.meta.env.VITE_BACKEND_URL}/images/avatar/${dataDetail.avatar}`} />
                    </div>
                    <br />
                    <div>
                        <label htmlFor="btnUpload" style={{
                            display: "block",
                            background: '#30a1ff',
                            width: "fit-content",
                            color: 'white',
                            borderRadius: '5px',
                            padding: '5px 10px',
                            cursor: 'pointer'

                        }}
                        >
                            Upload Avatar
                        </label>
                        <input type="file" hidden id="btnUpload"
                            onChange={handleOnChangeFile}
                        />
                    </div>
                    {preview &&
                        <>
                            <div style={{
                                marginTop: '10px',
                                marginBottom: '15px',
                                height: '100px', width: '150px',
                            }}>
                                <img style={{
                                    height: '100%', width: '100%',
                                    objectFit: 'contain'
                                }}
                                    src={preview} />
                            </div>
                            <Button type="primary"
                                onClick={() => handleUpdateUserAvatar()}
                            >Save</Button>
                        </>
                    }
                </>
                :
                <>
                    <p>No data</p>
                </>
            }
        </Drawer >
    )

}
export default ViewUserDetail;
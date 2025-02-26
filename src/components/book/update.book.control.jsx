import { useEffect, useState } from "react";
import { Input, notification, Modal, InputNumber, Select } from 'antd';
import { handleUploadFile, updateBookAPI } from "../../services/api.service";

const UpdateBookControl = (props) => {

    const [id, setId] = useState("");
    const [mainText, setMainText] = useState("");
    const [author, setAuthor] = useState("");
    const [price, setPrice] = useState("");
    const [quantity, setQuantity] = useState("");
    const [category, setCategory] = useState("");

    const { isModalUpdateOpen, setIsModalUpdateOpen,
        dataUpdate, setDataUpdate,
        loadBook } = props;

    const [selectedFile, setSelectedFile] = useState(null);
    const [preview, setPreview] = useState(null);
    useEffect(() => {
        if (dataUpdate && dataUpdate._id) {
            setId(dataUpdate._id);
            setMainText(dataUpdate.mainText);
            setAuthor(dataUpdate.author);
            setPrice(dataUpdate.price);
            setQuantity(dataUpdate.quantity);
            setCategory(dataUpdate.category);
            setPreview(`${import.meta.env.VITE_BACKEND_URL}/images/book/${dataUpdate.thumbnail}`)
        }
    }, [dataUpdate])

    const updateBook = async (newThumbnail) => {
        const resBook = await updateBookAPI(id, newThumbnail, mainText,
            author, price, quantity, category);
        if (resBook.data) {
            resetAndCloseModal();
            await loadBook();
            notification.success({
                message: "Update Book",
                description: "Book Updated!"
            });
        } else {
            notification.error({
                message: "Error Updating Book",
                description: JSON.stringify(resBook.message)
            });
        }
    }

    const handleSubmitBtn = async () => {

        //TH1: Khong co ảnh preview + file =>return
        if (!preview && !selectedFile) {
            notification.error({
                message: "Error Updating Book",
                description: "Vui lòng upload thumbnail!"
            })
            return;
        }
        let newThumbnail = "";
        //TH2: Có ảnh preview nhưng ko có file => không upload file
        if (preview && !selectedFile) {
            //do nothing
            newThumbnail = dataUpdate.thumbnail;
        } else {
            //có cả 2 => upload
            const resUpload = await handleUploadFile(selectedFile, "book");
            if (resUpload.data) {
                newThumbnail = resUpload.data.fileUploaded;
            } else {
                notification.error({
                    message: "Error Uploading file",
                    description: JSON.stringify(resUpload.message)
                });
                return;
            }
        }
        await updateBook(newThumbnail);

    }

    const resetAndCloseModal = () => {
        setId("");
        setMainText("");
        setAuthor("");
        setPrice("");
        setQuantity("");
        setCategory("");
        setIsModalUpdateOpen(false);
        setDataUpdate(null);
    }
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
    return (
        <Modal
            title="Update Book"
            open={isModalUpdateOpen}
            onOk={() => handleSubmitBtn()}
            onCancel={() => resetAndCloseModal()}
            maskClosable={false}
            okText={"Save"}
        >
            <div style={{ display: "flex", gap: "15px", flexDirection: "column" }}>
                <div>
                    <span>Id</span>
                    <Input
                        value={id}
                        disabled
                    />
                </div>
                <div>
                    <span>Tiêu đề</span>
                    <Input
                        value={mainText}
                        onChange={(event) => { setMainText(event.target.value) }}
                    />
                </div>
                <div>
                    <span>Tác giả</span>
                    <Input
                        value={author}
                        onChange={(event) => { setAuthor(event.target.value) }} />
                </div>
                <div>
                    <span>Giá tiền</span>
                    <InputNumber
                        style={{ width: "100%" }}
                        addonAfter={'d'}
                        value={price}
                        onChange={(event) => { setPrice(event) }} />
                </div>
                <div>
                    <span>Số lượng</span>
                    <InputNumber
                        style={{ width: "100%" }}
                        value={quantity}
                        onChange={(event) => { setQuantity(event) }} />
                </div>
                <div>
                    <span>Thể loại</span>
                    <Select
                        style={{ width: "100%" }}
                        value={category}
                        onChange={(value) => { setCategory(value) }}
                        options={[
                            { value: 'Arts', label: 'Arts' },
                            { value: 'Business', label: 'Business' },
                            { value: 'Comics', label: 'Comics' },
                            { value: 'Cooking', label: 'Cooking' },
                            { value: 'Entertainment', label: 'Entertainment' },
                            { value: 'History', label: 'History' },
                            { value: 'Music', label: 'Music' }, { value: 'Sports', label: 'Sports' },
                            { value: 'Teen', label: 'Teen' }, { value: 'Travel', label: 'Travel' },
                        ]} />
                </div>
                <div>
                    <div>Thumbnail</div>
                    <div>
                        <div>
                            <label htmlFor="btnUpload" style={{
                                display: "block",
                                background: '#30a1ff',
                                width: "fit-content",
                                color: 'white',
                                borderRadius: '5px',
                                padding: '5px 10px',
                                cursor: 'pointer'
                            }}>
                                Upload
                            </label>
                            <input
                                type='file' hidden id='btnUpload'
                                onChange={(event) => handleOnChangeFile(event)}
                                onClick={(event) => event.target.value = null}
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
                            </>
                        }
                    </div>

                </div>
            </div>
        </Modal>
    )
}
export default UpdateBookControl;
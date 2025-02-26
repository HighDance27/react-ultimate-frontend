
import { Input, notification, Modal, InputNumber, Select, Form } from 'antd';
import { useEffect, useState } from "react";
import { updateBookAPI, handleUploadFile } from "../../services/api.service";

const UpdateBookUncontrol = (props) => {

    const { isModalUpdateOpen, setIsModalUpdateOpen,
        dataUpdate, setDataUpdate, loadBook } = props;

    const [form] = Form.useForm();

    const [selectedFile, setSelectedFile] = useState(null);
    const [preview, setPreview] = useState(null);

    useEffect(() => {
        if (dataUpdate && dataUpdate._id) {
            form.setFieldsValue({
                id: dataUpdate._id,
                mainText: dataUpdate.mainText,
                author: dataUpdate.author,
                price: dataUpdate.price,
                quantity: dataUpdate.quantity,
                category: dataUpdate.category
            })
            setPreview(`${import.meta.env.VITE_BACKEND_URL}/images/book/${dataUpdate.thumbnail}`)
        }
    }, [dataUpdate])

    const updateBook = async (newThumbnail, values) => {
        const { id, mainText, author, price, quantity, category } = values;
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

    const handleSubmitBtn = async (values) => {

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
        await updateBook(newThumbnail, values);
    }

    const resetAndCloseModal = () => {
        form.resetFields();
        setSelectedFile(null);
        setPreview(null);
        setDataUpdate(null);
        setIsModalUpdateOpen(false);
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
            title="Update Book (uncontrolled component)"
            open={isModalUpdateOpen}
            onOk={() => form.submit()} //** */
            onCancel={() => resetAndCloseModal()}
            maskClosable={false}
            okText={"Save"}
        >
            <Form
                form={form}
                layout="vertical"
                onFinish={handleSubmitBtn} //**** */
            >
                <div style={{ display: "flex", flexDirection: "column" }}>
                    <div>
                        <Form.Item  //*********** */
                            label="Id"
                            name="id">
                            <Input disabled />
                        </Form.Item>
                    </div>
                    <div>
                        <Form.Item  //*********** */
                            label="Tiêu đề"
                            name="mainText"
                            rules={[
                                {
                                    required: true,
                                    message: 'Please input title!',
                                },
                            ]}>
                            <Input />
                        </Form.Item>
                    </div>
                    <div>
                        <Form.Item
                            label="Tác giả"
                            name="author"
                            rules={[
                                {
                                    required: true,
                                    message: 'Please input author!',
                                },
                            ]}>
                            <Input />
                        </Form.Item>
                    </div>
                    <div>
                        <Form.Item
                            label="Giá"
                            name="price"
                            rules={[
                                {
                                    required: true,
                                    message: 'Please input price!',
                                },
                            ]}>
                            <InputNumber
                                style={{
                                    width: "100%",
                                    addonAfter: 'd'
                                }}
                            />
                        </Form.Item>
                    </div>
                    <div>
                        <Form.Item
                            label="Số lượng"
                            name="quantity"
                            rules={[
                                {
                                    required: true,
                                    message: 'Please input quantity!',
                                },
                            ]}>
                            <InputNumber
                                style={{
                                    width: "100%",
                                }}
                            />
                        </Form.Item>
                    </div>
                    <div>
                        <Form.Item
                            label="Thể loại"
                            name="category"
                            rules={[
                                {
                                    required: true,
                                    message: 'Please select category!',
                                },
                            ]}>
                            <Select
                                style={{ width: "100%" }}
                                name="category"
                                options={[
                                    { value: 'Arts', label: 'Arts' },
                                    { value: 'Business', label: 'Business' },
                                    { value: 'Comics', label: 'Comics' },
                                    { value: 'Cooking', label: 'Cooking' },
                                    { value: 'Entertainment', label: 'Entertainment' },
                                    { value: 'History', label: 'History' },
                                    { value: 'Music', label: 'Music' }, { value: 'Sports', label: 'Sports' },
                                    { value: 'Teen', label: 'Teen' }, { value: 'Travel', label: 'Travel' },
                                ]}
                            />
                        </Form.Item>

                    </div>
                    <div>
                        <div>Thumbnail:</div>
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
                                style={{ display: "none" }} //*********** */
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
            </Form >
        </Modal>

    )
}
export default UpdateBookUncontrol;
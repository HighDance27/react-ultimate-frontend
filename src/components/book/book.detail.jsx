import { useState } from "react";
import { Drawer } from "antd";

const ViewBookDetail = (props) => {
    const {
        dataDetail, setDataDetail,
        isDetailOpen, setIsDetailOpen } = props;

    return (
        <Drawer
            width={"40vw"}
            title="Book Detail"
            onClose={() => {
                setDataDetail(null);
                setIsDetailOpen(false);
            }}
            open={isDetailOpen}
        >
            {dataDetail ? <>
                <p><span style={{ fontWeight: "bold" }}> Id: </span>
                    {dataDetail._id}</p> <br />
                <p><span style={{ fontWeight: "bold" }}> Tiêu đề: </span>
                    {dataDetail.mainText}</p> <br />
                <p><span style={{ fontWeight: "bold" }}> Tác giả: </span>
                    {dataDetail.author}</p> <br />
                <p><span style={{ fontWeight: "bold" }}> Thể loại: </span>
                    {dataDetail.category}</p> <br />
                <p><span style={{ fontWeight: "bold" }}> Giá tiền: </span>{
                    new Intl.NumberFormat('vi-VN', {
                        style: 'currency',
                        currency: 'VND'
                    }).format(dataDetail.price)
                }</p>
                <br />
                <p><span style={{ fontWeight: "bold" }}> Số lượng: </span>
                    {dataDetail.quantity}</p> <br />
                <p><span style={{ fontWeight: "bold" }}> Đã bán: </span>
                    {dataDetail.sold}</p> <br />
                <p><span style={{ fontWeight: "bold" }}> Thumbnail: </span>
                    <div style={{
                        marginTop: "10px",
                        height: "100px",
                        width: "150px",
                        border: "1px solid #ccc"
                    }}>
                        <img style={{ height: "100%", width: "100%", objectFit: "contain" }}
                            src={`${import.meta.env.VITE_BACKEND_URL}/images/book/${dataDetail.thumbnail}`}

                        />
                    </div>
                </p> <br />
            </>
                :
                <>
                    <p>No data</p>
                </>
            }
        </Drawer >
    )

}
export default ViewBookDetail;
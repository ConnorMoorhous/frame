import { useState } from "react";

const usePreviewImg = () => {
	const [previewImg, setPreviewImg] = useState(null);

	const handlePreviewChange = (file) => {

		const reader = new FileReader();

        reader.onloadend = () => {
            setPreviewImg(reader.result);
        };

        reader.readAsDataURL(file);
	};

	return { handlePreviewChange, previewImg, setPreviewImg};
};

export default usePreviewImg;

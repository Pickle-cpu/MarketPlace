import React, { useState, useEffect } from "react";
import "./NoteForm.css";
import "@aws-amplify/ui-react/styles.css";
import { Storage } from 'aws-amplify';

import {
  Button,
  Flex,
  Heading,
  Image,
  Text,
  TextField,
  View,
} from "@aws-amplify/ui-react";
import { getUserNotes } from "./graphql/queries";
import { updateTodo } from "./graphql/mutations";

const NoteForm = ({ onSubmit, onCancel, showImage }) => {
    const [formData, setFormData] = useState(
      {
        ListDescription: '',
        ListImage: '',
        ListTitle: '',
      }
    );
    // const [formVisible, setFormVisible] = useState(true);
  
    const [file, setFile] = useState(null);
    
    const handleInputChange = (event) => {
      const { name, value } = event.target;
      // 直接把这个匿名函数的值传给了setformdata
      // ...prevFormData是从之前的formdata继承所有的旧值
      setFormData((prevFormData) => ({
        ...prevFormData,
        [name]: value,
      }));
    };
  
    // New function for handling file input change
    const handleFileChange = (event) => {
      const file = event.target.files[0];
      setFile(file);
    };

    const handleSubmit = async (event) => {
      event.preventDefault();
      
      // Handle image upload here
      if (file) {
        const filename = `${Date.now()}-${file.name}`;
        const fileUrl = await Storage.put(filename, file, {
          contentType: file.type,
        });

        formData.ListImage = fileUrl.key;
      }

      const dataToSubmit = {};
      for (const key in formData) {
        if (formData.hasOwnProperty(key) && formData[key] !== '') {
          dataToSubmit[key] = formData[key];
        }
      }
      // 使用匿名函数
      onSubmit(dataToSubmit);

      // 重置 formData 为初始状态
      setFormData({
        ListDescription: '',
        ListImage: '',
        ListTitle: '',
      });
      setFile(null); // Reset the file input
    };

    const handleCancel = () => {
      setFormData({
        ListDescription: '',
        ListImage: '',
        ListTitle: '',
      });
      // setFormVisible(false);
      setFile(null); // Reset the file input
      onCancel();
    };
  
    // if (!formVisible) {
    //   return null; // 隐藏表单
    // }
  
    return (
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="ListDescription">ListDescription:</label>
          <input
            type="text"
            id="ListDescription"
            name="ListDescription"
            value={formData.ListDescription}
            onChange={handleInputChange}
            // required
          />
        </div>
        {showImage && (
        <div>
          <label htmlFor="ListImage">ListImage:</label>
          <input
            type="file"
            id="ListImage"
            name="ListImage"
            onChange={handleFileChange}
          />
        </div>
        )}
        {/* <div>
          <label htmlFor="ListStatus">ListStatus:</label>
          <input
            type="text"
            id="ListStatus"
            name="ListStatus"
            value={formData.ListStatus}
            onChange={handleInputChange}
            // required
          />
        </div> */}
        <div>
          <label htmlFor="ListDescription">ListTitle:</label>
          <input
            type="text"
            id="ListTitle"
            name="ListTitle"
            value={formData.ListTitle}
            onChange={handleInputChange}
            // required
          />
        </div>
        <button type="submit">Submit</button>
        <button type="button" onClick={handleCancel}>Cancel</button> {/* 添加取消按钮 */}
      </form>
    );
};

export default NoteForm;
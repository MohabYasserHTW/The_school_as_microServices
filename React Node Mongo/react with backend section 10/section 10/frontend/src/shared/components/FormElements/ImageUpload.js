import React, { useEffect, useState } from 'react'
import Button from "./Button"
import "./ImageUpload.css"
import { useRef } from 'react'


function ImageUpload(props) {
    const [file,setFile] = useState()
    const [previewUrl,setPreviewUrl] = useState()
    const [isValid,setIsValid] = useState()

    const filePickerRef = useRef()

    const pickImageHandeler = ()=>{
        filePickerRef.current.click()
    }

    const onImageChange = (e)=>{
        let pickedFile
        let fileValidation = isValid
        if(e.target.files && e.target.files.length === 1){
            pickedFile = e.target.files[0]
            setFile(pickedFile)
            setIsValid(true)
            fileValidation = true
            
        }else{
            setIsValid(false)
            fileValidation = false
        }
        props.onInput(props.id,pickedFile,fileValidation)
    }

    useEffect(()=>{
        if(!file){return}

        const fileReader = new FileReader()
        fileReader.onload = ()=>{
            setPreviewUrl(fileReader.result)
        }
        fileReader.readAsDataURL(file)

    },[file])


  return (
    <div className='form-control'>
        <input onChange={onImageChange} id={props.id} ref={filePickerRef} style={{display:"none"}} type='file' accept='.jpg,.jpeg,.png' />
        <div className={`image-upload ${props.center&&"center"}`}>
            <div className='image-upload__preview'>
                {previewUrl && <img src={previewUrl} alt='Preview' />}
                {!previewUrl && <p>Please Pick an image  </p>}
            </div>
            <Button type="button" onClick={pickImageHandeler}>PICK IMAGE</Button>
        </div>
    </div>
  )
}

export default ImageUpload
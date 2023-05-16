<template>
    <div class="Decrypt">
        <van-uploader :after-read="afterRead">
            <van-button icon="plus" type="primary" style="width: 70vw;" >上传文件</van-button>
        </van-uploader>

        <van-field
            v-model="privateKey"
            autosize
            label="私钥"
            type="textarea"
            placeholder="请输入私钥"
            @blur="showPublicKey"
            style="border: 1px solid gray;"
        />
        <van-button type="warning" @click="DecryptMessage">下载解密文件</van-button>
        <!-- <json-viewer :value="deMessage" copyable boxed sort /> -->
    </div>
</template>

<script>
import { closeToast, showFailToast, showLoadingToast, showSuccessToast } from 'vant';
import { reactive, ref, onMounted } from 'vue';
import JSEncrypt from 'jsencrypt';

export default {
    name: 'MyDecrypt',
    setup() {
        // 加密信息
        let enMessage = reactive([]);
        let privateKey = ref('');
        let deMessage = reactive({
            message: '请先上传文件进行解密！'
        });
        let uploadedFile;


        // 读取文件
        const afterRead = (file) => {
            uploadedFile = file;
            let myFileReader = new FileReader();
            // 此时可以自行将文件上传至服务器
            console.log('file--------------');
            // console.log('file', file);
            // console.log(file.file);
            myFileReader.readAsText(file.file);
            setTimeout(() => {
                let en = myFileReader.result;
                if (en.result == null) {
                    showSuccessToast({
                        message: '上传成功!',
                        forbidClick: false,
                        
                    })
                    enMessage = JSON.parse(en);
                    console.log(enMessage);
                }
                else {
                    showFailToast({
                        message: '上传失败，请重试'
                    })
                }
                
            }, 100);
            // console.log(uploadedFile.file.name);
        };
        const showPublicKey = (e) => {
            console.log(e.target.value);
        }

        const DecryptMessage = () => {
            showLoadingToast({
                message: '解密中...',
                forbidClick: true,
                overlay: true,
                duration: 0,
            })
            let decrypt = new JSEncrypt();
            decrypt.setPrivateKey(privateKey.value);
            for (let i = 0; i < enMessage.length; i++) {
                for (let j = 0; j < enMessage[i].answerResult.length; j++) {
                    enMessage[i].answerResult[j] = decrypt.decrypt(enMessage[i].answerResult[j]);
                }
            }

            // console.log(enMessage);
            let deMessageStr = JSON.stringify(enMessage, null, 4);
            const blob = new Blob([deMessageStr], {
                type: 'application/json'
            })
            const objectURL = URL.createObjectURL(blob)
            const aTag = document.createElement('a')
            aTag.href = objectURL
            aTag.download = uploadedFile.file.name.split('.')[0] + '-解密结果.json';
            aTag.click()
            URL.revokeObjectURL(objectURL)
            closeToast();


        }
        onMounted(() => {

        });
        return {
            afterRead,
            privateKey,
            showPublicKey,
            DecryptMessage,
            deMessage,
        }
    },
}
</script>

<style>
.Decrypt {
    width: 70vw;
    height: auto;
    display: flex;
    flex-direction: column;
    justify-content: center;
    margin-top: 50px;
}


    
</style>
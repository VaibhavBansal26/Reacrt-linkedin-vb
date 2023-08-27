import React from 'react';
import styled from 'styled-components';
import {useState} from 'react';
import ReactPlayer from 'react-player';
import {connect} from 'react-redux';
import firebase from 'firebase';
import {postArticleAPI} from '../actions';

function PostModal(props) {
    const [text,setText] = useState("");
    const[shareImage,setShareImage] = useState("");
    const[videoLink,setVideoLink] = useState("");
    const [assetArea,setAssetArea] = useState("");

    const handleChange = (e) => {
        const image = e.target.files[0];
        if(image === '' || image === undefined){
            alert(`Not an image, the file is a ${typeof image} `);
            return;
        }
        setShareImage(image);
    }

    const switchAssetArea = (area) => {
        setShareImage("");
        setVideoLink("");
        setAssetArea(area);
    };

    const postArticle = (e) => {
        e.preventDefault();
        if(e.target !== e.currentTarget){
            return;
        }

        const payload = {
            image:shareImage,
            video:videoLink,
            user:props.user,
            description:text,
            timestamp:firebase.firestore.Timestamp.now()
        };
        props.postArticle(payload);
        reset(e);
    }

    const reset = (e) => {
        setText("");
        setShareImage("");
        setVideoLink("");
        setAssetArea("");
        props.handleClick(e);
    }

    return (
        <>
        { props.showModal === 'open' &&
        <Container>
            <Content>
                <Header>
                    <h2>Create a post</h2>
                    <button onClick={(event) => reset(event)}>
                        <img src="/images/close-icon.svg" alt=""/>
                    </button>
                </Header>
                <SharedContent>
                    <UserInfo>
                        {props.user?.photoURL ? <img src={props.user.photoURL} alt=""/>:<img src="images/user.svg" alt=""/>}
                        <span>{props.user?.displayName}</span>
                    </UserInfo>
                    <Editor>
                        <textarea value={text} onChange={(e) => setText(e.target.value)} placeholder="What do you want to talk about?" autoFocus={true}/>
                        { assetArea === 'image'?
                        <UploadImage>
                            <input type="file" accept="image/gif, image/jpeg, image/png" name="image" id="file" 
                                style={{display:"none"}}
                                onChange={handleChange}
                            />
                        
                        <p>
                            <label htmlFor="file"

                            >Select an image to share</label>
                        </p>
                        {shareImage && <img src={URL.createObjectURL(shareImage)} alt=""/>}
                        </UploadImage>:
                        assetArea === 'media' &&(
                        <>
                        <input 
                            type="text"
                            placeholder="Please input video link"
                            value={videoLink}
                            onChange={(e) => setVideoLink(e.target.value)}
                            />
                        {videoLink && <ReactPlayer width={'100%'} url={videoLink}/>}
                        </>)
                       }
                    </Editor>                
                </SharedContent>
                <SharedCreation>
                    <AttachAssets>
                        <AssetButton onClick={() => switchAssetArea("image")}>
                            <img src="/images/share-image.svg" alt=""/>
                        </AssetButton>
                        <AssetButton onClick={() => switchAssetArea("media")}>
                            <img src="/images/share-video.svg" alt=""/>
                        </AssetButton>
                    </AttachAssets>
                    <ShareComment>
                    <AssetButton>
                        <img src="/images/share-comment.svg" alt=""/>
                        Anyone
                    </AssetButton>
                    </ShareComment>
                    <PostButton 
                        onClick={(event) => postArticle(event)}
                        disabled={!text ? true:false}>Post</PostButton>
                </SharedCreation>
            </Content>
        </Container>
            }
        </>
    )
}

const Container  = styled.div`
    position:fixed;
    top:0;
    left:0;
    right:0;
    bottom:0;
    z-index:200;
    color:black;
    background-color:rgba(0,0,0,0.7);
    animation:fadeIn 0.4s;
    
`;


const Content = styled.div`
    width:100%;
    max-width:553px;
    background-color:white;
    max-height:90%;
    overflow:initial;
    border-radius:5px;
    position:relative;
    display:flex;
    flex-direction:column;
    top:42px;
    margin:0 auto;
    padding:10px;
`;

const Header = styled.div`
    display:block;
    padding:16px 6px;
    border-bottom:1px solid rgba(0,0,0,0.15);
    font-size:16px;
    line-height:1.5;
    color:rgba(0,0,0,0.6);
    font-weight:400;
    display:flex;
    justify-content:space-between;
    align-items:center;
    button{
        height:40px;
        width:40px;
        min-width:auto;
        color:rgba(0,0,0,0.15);
        background-color:transparent;
        border:none;
        svg,img{
            pointer-events:none;
        }
    }
`;


const SharedContent = styled.div`
    display:flex;
    flex-direction:column;
    flex-grow:1;
    overflow-y:auto;
    vertical-align:baseline;
    background:transparent;
    padding:8px 24px;
`;
const UserInfo = styled.div`
    display:flex;
    align-items:center;
    padding:12px 24px;
    svg,img{
        width:48px;
        height:48px;
        background-clip:content-box;
        border:2px solid transparent;
        border-radius:50%;
    }
    span{
        font-weight:600;
        font-size:16px;
        line-height:1.5;
        margin-left:5px;
    }
`;

const SharedCreation = styled.div`
    display:flex;
    justify:content:space-between;
    padding:12px 24px 12px 16px;
`;

const AssetButton = styled.button`
    display:flex;
    align-items:center;
    height:40px;
    min-width:auto;
    color:rgba(0,0,0,0.5);
    background-color:transparent;
    border:none;
    outline:none;
`;

const AttachAssets = styled.div`
    align-items:center;
    display:flex;
    padding-right:8px;
    ${AssetButton}{
        width:40px;
    }
`;

const ShareComment = styled.div`
    padding-left:8px;
    margin-right:auto;
    border-left:1px solid rgba(0,0,0,0.15);
    ${AssetButton}{
        svg{
            margin-right:5px;
        }
    }
`;

const PostButton = styled.button`
    min-width:60px;
    border-radius:20px;
    padding-left:16px;
    padding-right:16px;
    background-color:${props => props.disabled ? 'rgba(0,0,0,0.6)': '#0a66c2' };
    color:white;
    font-weight:600;
    outline:none;
    border:1px solid lightgray;
    &:hover{
        background-color:${props => props.disabled ? 'rgba(0,0,0,0.6)': '#0a66c2' };
    }
`;

const Editor = styled.div`
    padding:12px 24px;
    textarea{
        width:100%;
        min-height:130px;
        resize:none;
        border:none;
        font-size:16px;
        color:black;
        font-weight:600;
    }
    input{
        width:100%;
        height:35px;
        font-size:16px;
        margin-bottom:20px;
    }
`;

const UploadImage = styled.div`
    text-align:center;
    img{
        width:100%;
    }
`;

const mapStateToProps = (state) => {
    return{
        user:state.userState.user,
    };
  }

const mapDispatchToProps = (dispatch) => ({
    postArticle:(payload) => dispatch(postArticleAPI(payload))
})

export default connect(mapStateToProps,mapDispatchToProps)(PostModal);

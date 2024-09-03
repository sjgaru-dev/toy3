import React, { useState, KeyboardEvent } from 'react'
import styled from '@emotion/styled'
import { X } from 'lucide-react'
import { colors } from '@/constants/color'
import { fontSize } from '@/constants/font'
import { createPlayList } from '@/api/playlist/createPlayList'
import { videoListProps } from '@/types/playlistType'
import Button from '@/components/common/Button/Button'
import Input from '@/components/common/Input/Input'
import { Trash2 } from 'lucide-react'
import PLlogo from '@/assets/createlist_logo.svg'

const CreatePlaylistPage = () => {
  const [title, setTitle] = useState('')
  const [currentTag, setCurrentTag] = useState('')
  const [tag, setTag] = useState<string[]>([])
  const [url, setUrl] = useState('')
  const [isValid, setIsValid] = useState(true)
  const [videoList, setVideoList] = useState<videoListProps[]>([])
  const [isPrivate, setIsPrivate] = useState(false)

  const handleUploadMusic = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await createPlayList(title, tag, videoList, isPrivate)
      setTitle('')
      setTag([])
      setUrl('')
      setVideoList([])
      setCurrentTag('')
      setIsPrivate(false)
    } catch (error) {
      console.error('Error adding playlist: ', error)
    }
  }

  const handleAddList = async () => {
    const isValidYoutubeUrl = (url: string) => {
      const regex = /^(https?:\/\/)?(www\.youtube\.com|youtu\.?be)\/.+$/
      return regex.test(url)
    }

    if (!isValidYoutubeUrl(url)) {
      setIsValid(false)
      return
    }

    setIsValid(true)

    const youtubeKey = import.meta.env.VITE_YOUTUBE_API_KEY
    const videoId = url.split('v=')[1]?.split('&')[0]
    const videoUrl = `https://www.googleapis.com/youtube/v3/videos?part=snippet&id=${videoId}&key=${youtubeKey}`

    try {
      const res = await fetch(videoUrl)
      const data = await res.json()

      if (data.items && data.items.length > 0) {
        const videoData = {
          title: data.items[0].snippet.title,
          channelTitle: data.items[0].snippet.channelTitle,
          url: `https://www.youtube.com/watch?v=${videoId}`,
          thumbnail: data.items[0].snippet.thumbnails.medium.url,
        }
        setVideoList((prev: videoListProps[]) => [...prev, videoData])
        setUrl('')
      }
    } catch (error) {
      console.error('add list error :', error)
    }
  }

  const handleTag = (e: KeyboardEvent) => {
    if (e.key === 'Enter' && currentTag.trim() !== '' && e.nativeEvent.isComposing === false) {
      e.preventDefault()
      const saveTag = currentTag.trim().startsWith('#')
        ? currentTag.trim()
        : `#${currentTag.trim()}`
      setTag((prev: string[]) => [...prev, saveTag])
      setCurrentTag('')
    }
  }

  const handleDelete = (id: number) => {
    setVideoList((prev: videoListProps[]) => prev.filter((_, index) => index !== id))
  }

  const handleTagDelete = (id: number) => {
    setTag((prev) => prev.filter((_, index) => index !== id))
  }

  const handlePrivate = () => {
    setIsPrivate(!isPrivate)
  }

  const isUploadDisabled = title.trim() === '' || tag.length === 0 || videoList.length === 0

  return (
    <Container>
      <form onSubmit={handleUploadMusic}>
        <div className="section-input">
          <Input
            className="input-title"
            type="text"
            placeholder="플레이리스트의 제목을 입력하세요."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <Input
            className="input-tag"
            type="text"
            placeholder="태그를 입력하세요."
            value={currentTag}
            onChange={(e) => setCurrentTag(e.target.value)}
            onKeyDown={handleTag}
          />
          <div className="container-tag">
            {tag.map((t, idx) => (
              <span key={idx} className="tag">
                {t}
                <button
                  className="btn-tagdelete"
                  type="button"
                  onClick={() => handleTagDelete(idx)}
                >
                  <X size={18} />
                </button>
              </span>
            ))}
          </div>
        </div>
        {videoList.length > 0 ? (
          <div className="list-music">
            {videoList.map((item: videoListProps, idx) => (
              <div key={idx} className="item-video">
                <img src={item.thumbnail} alt={`${item.title}`} />
                <div>
                  <p>{item.title}</p>
                  <span>{item.channelTitle}</span>
                </div>
                <button className="btn-delete" type="button" onClick={() => handleDelete(idx)}>
                  <Trash2 color={colors.lightGray} />
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="list-music">
            <div className="pl-notice">
              <img className="pl-logo" src={PLlogo} alt="링크 입력" />
              <span>
                추가하고 싶은 곡의
                <br />
                유튜브 링크를 남겨주세요.
              </span>
            </div>
          </div>
        )}
        <div className="section-upload">
          <div className="check-private">
            <input type="checkbox" onChange={handlePrivate} checked={isPrivate} />
            비공개
          </div>
          <div className="input-youtube">
            <Input
              className="input-link"
              type="text"
              placeholder="유튜브 링크를 입력하세요."
              value={url}
              onChange={(e) => setUrl(e.target.value)}
            />
            <button className="btn-add" type="button" onClick={handleAddList}>
              곡 추가
            </button>
          </div>
          {!isValid && <span className="text-warning">유튜브 링크를 입력해주세요.</span>}
          <Button disabled={isUploadDisabled}>등록하기</Button>
        </div>
      </form>
    </Container>
  )
}

export default CreatePlaylistPage

const Container = styled.div`
  display: flex;
  flex-direction: column;

  .section-input,
  .list-music {
    margin: 0 20px;
  }

  .section-upload {
    position: fixed;
    bottom: 55px;
    width: 100%;
    max-width: 430px;
    align-items: center;
  }

  .input-link {
    width: 100%;
    margin-bottom: 5px;
    padding: 16px 18px;
    border: 1px solid ${colors.lightGray};
    border-radius: 5px;
  }

  .input-title,
  .input-tag,
  .btn-upload,
  .btn_add {
    width: 100%;
    padding: 16px 18px;
    margin-bottom: 10px;
    border: 1px solid ${colors.lightGray};
    border-radius: 5px;
  }

  .list-music {
    padding: 20px 0;
    display: flex;
    height: 350px;
    flex-direction: column;
    gap: 16px;
    overflow-y: auto;

    .pl-notice {
      display: flex;
      flex-direction: column;
      align-items: center;
      color: ${colors.gray};
      font-size: ${fontSize.md};
      text-align: center;
    }
    .pl-logo {
      width: 73px;
      height: 73px;
      margin: 60px 0 26px 0;
    }
  }

  .item-video {
    display: flex;
    align-items: center;
    padding: 10px;
    border-radius: 5px;
    background-color: ${colors.white};
  }

  .item-video img {
    width: 120px;
    height: 90px;
    object-fit: cover;
    border-radius: 5px;
    margin-right: 14px;
  }

  .item-video div {
    display: flex;
    flex-direction: column;
    width: 210px;
    margin-right: 14px;
  }

  .item-video p {
    font-size: ${fontSize.md};
    font-weight: bold;
    margin: 0;
    color: ${colors.black};
  }

  .item-video span {
    font-size: ${fontSize.sm};
    color: ${colors.gray};
    margin-top: 4px;
  }

  .input-youtube {
    display: flex;
    gap: 10px;
  }

  .btn-add {
    right: 10px;
    width: 100px;
    top: 10px;
    border: 1px solid ${colors.lightGray};
    color: ${colors.white};
    background-color: ${colors.primaryPurple};
    border-radius: 15px;
    margin-bottom: 5px;
    cursor: pointer;
  }

  .btn-delete {
    width: 38px;
    height: 37px;
    border: 1px solid ${colors.lightestGray};
    border-radius: 50px;
    padding: 5px;
    cursor: pointer;
  }

  .btn-upload {
    border: 1px solid ${colors.lightGray};
    border-radius: 5px;
    background-color: ${colors.primaryPurple};
    color: ${colors.white};
    cursor: pointer;
  }

  .btn-upload:disabled {
    pointer-events: none;
    opacity: 0.4;
  }

  .text-warning {
    color: red;
    margin-left: 10px;
    font-size: ${fontSize.sm};
  }

  .container-tag {
    display: flex;
    flex-wrap: nowrap;
    gap: 8px;
    max-width: 100%;
    overflow-x: auto;
    white-space: nowrap;
  }

  .tag {
    background-color: ${colors.primaryPurple};
    border-radius: 20px;
    padding: 5px 10px;
    font-size: ${fontSize.sm};
    color: ${colors.white};
    display: flex;
    align-items: center;
    flex-shrink: 0;
  }

  .btn-tagdelete {
    background-color: ${colors.primaryPurple};
    border: none;
    color: ${colors.white};
    cursor: pointer;
    margin-top: 3px;
    margin-left: 2px;
  }
`

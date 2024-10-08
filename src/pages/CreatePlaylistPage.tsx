import React, { useState } from 'react'
import styled from '@emotion/styled'
import { colors } from '@/styles/colors'
import { fontSize } from '@/styles/font'
import Button from '@/components/common/Button/Button'
import PLlogo from '@/assets/createlist_logo.svg'
import LineInput from '@/components/common/Input/LineInput'
import { MESSAGES } from '@/constants/messages'
import useTags from '@/hooks/useTags'
import usePLItem from '@/hooks/usePLItem'
import MusicItem from '@/components/playlist/MusicItem'
import createNewPlaylist from '@/service/playlist/createNewPlaylist'
import { useNavigate } from 'react-router-dom'
import { getLoggedInUserUID, getUserIdFromUID } from '@/utils/userDataUtils'
import TagList from '@/components/playlist/TagList'

const CreatePlaylistPage = () => {
  const navigate = useNavigate()
  const [title, setTitle] = useState('')
  const [isPrivate, setIsPrivate] = useState(false)
  const uid = getLoggedInUserUID()
  const {
    errorMessage,
    tags,
    currentTag,
    setCurrentTag,
    isTagValid,
    handleAddTag,
    handleDeleteTag,
    setTags,
  } = useTags()
  const { url, setVideoList, videoList, handleAddList, isValid, setUrl, handleDelete, validType } =
    usePLItem()

  const handleUploadMusic = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await createNewPlaylist(title, tags, videoList, isPrivate)
      setTitle('')
      setTags([])
      setUrl('')
      setVideoList([])
      setCurrentTag('')
      setIsPrivate(false)

      if (uid) {
        const id = await getUserIdFromUID(uid)

        if (id) {
          navigate(`/profile/${id}`)
        }
      }
    } catch (error) {
      console.error('Error adding playlist: ', error)
    }
  }

  const handlePrivate = () => {
    setIsPrivate(!isPrivate)
  }

  const isUploadDisabled = title.trim() === '' || tags.length === 0 || videoList.length === 0

  return (
    <Container>
      <form onSubmit={handleUploadMusic}>
        <div className="section-input">
          <LineInput
            className="input-title"
            type="text"
            lineType="thin"
            placeholder="플레이리스트의 제목을 입력하세요."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
        {videoList.length > 0 ? (
          <div className="list-music">
            <MusicItem videoList={videoList} onItemDelete={handleDelete} variant="createPL" />
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
        <div className="input-youtube">
          <LineInput
            className="input-link"
            type="text"
            lineType="thin"
            placeholder="유튜브 링크를 입력하세요."
            value={url}
            onChange={(e) => setUrl(e.target.value)}
          />
          <button className="btn-add" type="button" onClick={handleAddList}>
            곡 추가
          </button>
        </div>
        {!isValid &&
          validType.length > 0 &&
          (validType === 'Youtube' ? (
            <span className="text-warning">{MESSAGES.CREATE_PL.YOUTUBE}</span>
          ) : (
            <span className="text-warning">{MESSAGES.CREATE_PL.DUPLICATION}</span>
          ))}
        <div className="section-upload">
          <LineInput
            className="input-tag"
            type="text"
            lineType="none"
            placeholder="태그 입력 후 Enter를 눌러 추가하세요."
            value={currentTag}
            onChange={(e) => setCurrentTag(e.target.value)}
            onKeyDown={handleAddTag}
          />
          <TagList tags={tags} onTagDelete={handleDeleteTag} />
        </div>
        {!isTagValid && <span className="text-warning">{errorMessage}</span>}
        <div className="pl-upload">
          <label className="check-private">
            <input type="checkbox" onChange={handlePrivate} checked={isPrivate} />
            <span>비공개로 업로드</span>
          </label>
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
  height: 80vh;

  .pl-upload {
    position: fixed;
    bottom: 51px;
    width: 100%;
    max-width: 430px;
    button {
      border-radius: 0px;
    }
  }

  .list-music,
  .input-youtube,
  .section-upload,
  .text-warning {
    margin: 0 20px;
  }

  .section-input {
    margin: 10px 20px 0;
  }

  .section-upload {
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
    border: 1px solid ${colors.lightGray};
    border-radius: 5px;
  }

  .list-music {
    padding: 20px 0;
    display: flex;
    height: 210px;
    max-height: 380px;
    flex-direction: column;
    gap: 15px;
    overflow-y: auto;
    @media (min-width: 400px) {
      height: 420px;
    }

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
      margin: 20px 0 20px 0;
    }
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

  .text-warning {
    color: red;
    font-size: ${fontSize.sm};
  }

  .check-private {
    display: flex;
    align-items: center;
    margin-bottom: 5px;
    margin-left: 10px;

    input {
      appearance: none;
      margin-right: 10px;
      width: 20px;
      height: 20px;
      border: 2px solid ${colors.lightGray};
      border-radius: 4px;
      cursor: pointer;
      position: relative;
    }

    input:checked {
      background-color: ${colors.primaryPurple};
      border-color: ${colors.black};
    }
  }
`

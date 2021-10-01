import React from 'react'

import Image from '../../components/Image/Image'
import Cta from '../../components/Cta/Cta'

import './Post.sass'

const Post = ({ data }) => {
  const { date, featuredImage, title, slug, content, locale, nodeType } = data

  const isEvent = nodeType === 'Event'

  const dateOptions = { year: 'numeric', month: 'long', day: 'numeric' },
    theDate = new Date(
      isEvent ? data.eventField.eventDate : date
    ).toLocaleDateString(locale.id, dateOptions)

  const text = content.replace(/(<([^>]+)>)/gi, '')
  const abstract = text.split(' ').splice(0, 14).join(' ')

  const attrs = {}

  if (isEvent) attrs['data-label'] = locale.id === 'it' ? 'Evento' : 'Event'

  return (
    <>
      <article className={`post${isEvent ? ' --event' : ''}`}>
        <div>
          <div className="post__image" {...attrs}>
            {featuredImage && (
              <Image
                image={featuredImage.node.localFile}
                title={featuredImage.node.altText}
              />
            )}
          </div>
          <div className="post__date">
            <h4>{theDate}</h4>
            {data.eventField?.eventTimeStart && (
              <h4>
                ore: {data.eventField.eventTimeStart}
                {data.eventField?.eventTimeStart ? ` - ${data.eventField?.eventTimeEnd}`: ``}
              </h4>
            )}
          </div>
          <h4 className="--primary --medium">{title}</h4>
          <div className="wysiwyg">
            <p>{abstract}...</p>
          </div>
        </div>

        <Cta
          url={slug}
          label={locale.id === 'it' ? 'Scopri' : 'Discover'}
          type={nodeType}
        />
      </article>
    </>
  )
}

export default Post

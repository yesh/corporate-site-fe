import React, { useContext } from 'react'

import { useStaticQuery, graphql } from 'gatsby'

import LinesEllipsis from 'react-lines-ellipsis'

import { LocaleContext } from '../../contexts/LocaleContext.js'

import Cta from '../../components/Cta/Cta'

import './PressRelease.sass'

const LatestPress = () => {
  const locale = useContext(LocaleContext)

  const data = useStaticQuery(graphql`
    query pressReleases {
      allWpPressReleases {
        edges {
          node {
            date
            title
            slug
            content
            locale {
              id
            }
            nodeType
          }
        }
      }
    }
  `),
  { edges: pressReleases } = data.allWpPressReleases

  const currentLocalePress = pressReleases.filter(j => j.node.locale.id === locale)

  return (
    <>
      {currentLocalePress.map((pr, key) => {
        const { date, title, slug, content, locale, nodeType } = pr.node


        const dateOptions = { year: 'numeric', month: 'long', day: 'numeric' },
              theDate = new Date(date).toLocaleDateString(locale.id, dateOptions)

        const text = content.replace(/(<([^>]+)>)/ig, '')
        
        return (
          <div className="col-12 col-lg-6 d-flex" key={key}>
            <article className="press-release">
              <div>
                <h4>{theDate}</h4>
                <h4 className="--primary --medium">{title}</h4>
                <div className="wysiwyg">
                  <LinesEllipsis
                    text={text}
                    maxLine='3'
                    component="p"
                    basedOn='letters'
                  />
                </div>
              </div>

              <Cta url={slug} label="Leggi" type={nodeType}/>
            </article>
          </div>
        )
      })}
    </>
  )
}

const PressRelease = ({ data }) => {

  const { title, link } = data

  const { title: ctaTitle, url } = link

  return (
    <section className="block --block-press-release press-releases">
      <div className="container-fluid">
        <div className="row">
          <div className="col-12 col-md-10 offset-md-1">
            <h1>{title}</h1>
            <div className="row pt-5">
              <LatestPress />
            </div>
            <Cta label={ctaTitle} url={url} variant="link" />
          </div>
        </div>
      </div>
    </section>
  )
}

export default PressRelease

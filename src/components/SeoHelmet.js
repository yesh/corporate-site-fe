import React from 'react'

import { Helmet } from 'react-helmet'

import { useWpOptionsPage } from '../hooks/useWpOptionsPage'
import { useSiteMetadata } from '../hooks/useSiteMetadata'

const SeoHelmet = ({ yoast, locale, data }) => {
  const { title, description, siteUrl } = useSiteMetadata()

  const {
    defaultSeo: {
      seoTitle: siteTitle,
      seoDescription: siteDescription,
      image: siteImage,
    },
  } = useWpOptionsPage()

  const { title: postTitle, featuredImage: postImage } = data

  const {
    opengraphTitle: yoastTitle,
    opengraphDescription: yoastDescription,
    opengraphImage: yoastImage,
    opengraphType: yoastType,
  } = yoast

  const seoSettings = {
    title: yoastTitle || `${postTitle} - ${siteTitle}` || title,
    description: yoastDescription || siteDescription || description,
    image:
      yoastImage?.localFile.childImageSharp.fixed.src ||
      postImage?.node.localFile.childImageSharp.fixed.src ||
      siteImage?.localFile.publicURL,
  }

  return (
    <Helmet
      htmlAttributes={{
        lang: locale,
      }}
      title={seoSettings.title}
      meta={[
        {
          name: `description`,
          content: seoSettings.description,
        },
        {
          property: `og:title`,
          content: seoSettings.title,
        },
        {
          property: `og:description`,
          content: seoSettings.description,
        },
        {
          property: `og:image`,
          content: `${siteUrl}${seoSettings.image}`,
        },
        {
          property: `og:type`,
          content: yoastType || `website`,
        },
        {
          name: `twitter:card`,
          content: `summary`,
        },
        {
          name: `twitter:title`,
          content: seoSettings.title,
        },
        {
          name: `twitter:description`,
          content: seoSettings.description,
        },
      ]}
    />
  )
}

export default SeoHelmet
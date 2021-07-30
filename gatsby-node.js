const _ = require('lodash')
const path = require('path')

exports.createPages = async ({ graphql, actions, reporter }) => {
  const { createPage } = actions

  const pageTemplate = path.resolve(`./src/templates/page.js`)
  const projectTemplate = path.resolve(`./src/templates/project.js`)
  const jobTemplate = path.resolve(`./src/templates/job.js`)
  const brandAssetsTemplate = path.resolve(`./src/templates/brandAssets.js`)
  const pressReleasesTemplate = path.resolve(`./src/templates/pressArticle.js`)
  const pressTemplate = path.resolve(`./src/templates/press.js`)

  const result = await graphql(`
    {
      themeSettings: wp(locales: { eq: "it" }) {
        options {
          globalData {
            translations {
              stringKey
              itValue
              enValue
            }
          }
        }
      }

      homePages: allWpPage(
        filter: { template: { templateName: { eq: "Homepage" } } }
      ) {
        edges {
          node {
            id
            locale {
              id
            }
          }
        }
      }

      defaultPages: allWpPage(
        filter: { template: { templateName: { eq: "Default" } } }
      ) {
        edges {
          node {
            id
            slug
            uri
            locale {
              id
            }
            postConfig {
              doNotBuild
            }
          }
        }
      }
      
      pressPages: allWpPage(
        filter: { template: { templateName: { eq: "Press Release" } } }
      ) {
        edges {
          node {
            id
            slug
            uri
            locale {
              id
            }
          }
        }
      }

      projectPages: allWpProject {
        edges {
          node {
            id
            slug
            uri
            locale {
              id
            }
          }
        }
      }

      jobPages: allWpJobPosition {
        edges {
          node {
            id
            slug
            locale {
              id
            }
          }
        }
      }

      pressReleases: allWpPressReleases {
        edges {
          node {
            id
            slug
            locale {
              id
            }
          }
        }
      }

    }
  `)

  if (result.errors) {
    reporter.panicOnBuild(`Something went horribly wrong!`, result.errors)
    return
  }

  // press

  const pressNodes = result.data.pressPages.edges

  _.each(pressNodes, ({ node: page }) => {
    createPage({
      path: `/${page.locale.id}/${page.uri}`,
      component: pressTemplate,
      context: {
        id: page.id,
        locale: page.locale.id,
      },
    })
  })



  // homepages

  const homepageNodes = result.data.homePages.edges

  _.each(homepageNodes, ({ node: page }) => {
    createPage({
      path: `/${page.locale.id}/`,
      component: pageTemplate,
      context: {
        id: page.id,
        locale: page.locale.id,
      },
    })
  })

  // pages

  const defaultNodes = result.data.defaultPages.edges

  _.each(defaultNodes, ({ node: page }) => {
    if (!page.postConfig.doNotBuild) {
      createPage({
        path: `/${page.locale.id}/${page.uri}`,
        component: pageTemplate,
        context: {
          id: page.id,
          locale: page.locale.id,
        },
      })
    }
  })


  // cpts generation with directory slug replace

  const { translations } = result.data.themeSettings.options.globalData

  // projects

  const projectNodes = result.data.projectPages.edges

  const projectTranslations = translations.find(
    t => t.stringKey === 'project_cpt_slug'
  )

  _.each(projectNodes, ({ node: page }) => {
    const projectDir = page.locale.id === 'it'
        ? projectTranslations.itValue
        : projectTranslations.enValue

    createPage({
      path: `/${page.locale.id}/${projectDir}/${page.slug}`,
      component: projectTemplate,
      context: {
        id: page.id,
        locale: page.locale.id,
      },
    })
  })

  // job positions

  const jobNodes = result.data.jobPages.edges

  const jobTranslations = translations.find(
    t => t.stringKey === 'job_cpt_slug'
  )

  _.each(jobNodes, ({ node: page }) => {
    const jobDir = page.locale.id === 'it'
        ? jobTranslations.itValue
        : jobTranslations.enValue

    createPage({
      path: `/${page.locale.id}/${jobDir}/${page.slug}`,
      component: jobTemplate,
      context: {
        id: page.id,
        locale: page.locale.id,
      },
    })
  })

  // press releases

  const pressReleasesNodes = result.data.pressReleases.edges

  const pressReleasesTranslations = translations.find(
    t => t.stringKey === 'pressrelease_cpt_slug'
  )

  _.each(pressReleasesNodes, ({ node: page }) => {
    const pressReleasesDir = page.locale.id === 'it'
        ? pressReleasesTranslations.itValue
        : pressReleasesTranslations.enValue

    createPage({
      path: `/${page.locale.id}/${pressReleasesDir}/${page.slug}`,
      component: pressReleasesTemplate,
      context: {
        id: page.id,
        locale: page.locale.id,
      },
    })
  })

}



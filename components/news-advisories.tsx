"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface NewsArticle {
  title: string
  description: string
  url: string
  urlToImage: string
  publishedAt: string
  source: string
}

export default function NewsAdvisories() {
  const [articles, setArticles] = useState<NewsArticle[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await fetch("/api/news")
        const data = await response.json()
        if (data.error) {
          setError(data.error)
        } else {
          setArticles(data.articles || [])
        }
      } catch (err) {
        setError("Failed to fetch news")
      } finally {
        setLoading(false)
      }
    }

    fetchNews()
  }, [])

  if (loading) {
    return (
      <div className="space-y-4">
        <h2 className="text-2xl font-bold">News Advisories</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(3)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </CardHeader>
              <CardContent>
                <div className="h-16 bg-gray-200 rounded"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-4">
        <h2 className="text-2xl font-bold">News Advisories</h2>
        <Alert>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">News Advisories</h2>
      {articles.length === 0 ? (
        <p className="text-muted-foreground">No news articles available at the moment.</p>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {articles.map((article, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <CardTitle className="text-lg leading-tight">{article.title}</CardTitle>
                  <Badge variant="secondary" className="ml-2 flex-shrink-0">
                    {article.source}
                  </Badge>
                </div>
                <CardDescription>
                  {new Date(article.publishedAt).toLocaleDateString()}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground line-clamp-3">
                  {article.description}
                </p>
                {article.url !== "#" && (
                  <a
                    href={article.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-blue-600 hover:underline mt-2 inline-block"
                  >
                    Read more →
                  </a>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

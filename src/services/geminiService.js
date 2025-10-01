import { GoogleGenAI, Modality } from "@google/genai"

const apiKey = import.meta.env.VITE_GEMINI_API_KEY

if (!apiKey) {
  throw new Error("VITE_GEMINI_API_KEY environment variable is not set. Please add it to your .env.local file.")
}

const ai = new GoogleGenAI({ apiKey })

const dataUrlToBlob = (dataUrl) => {
  const [header, data] = dataUrl.split(',')
  const mimeType = header.match(/:(.*?);/)?.[1] || 'image/png'
  return { data, mimeType }
}

/**
 * Edita uma imagem usando máscara e prompt com AI
 * @param {string} baseImage - Data URL da imagem base
 * @param {string} maskImage - Data URL da máscara
 * @param {string} prompt - Prompt para edição
 * @param {Array} objectImages - Array de imagens de referência
 * @param {string} combinedImage - Data URL da imagem base + máscara (opcional)
 * @returns {Promise<{image: string|null, text: string|null}>}
 */
export async function editImageWithMask(baseImage, maskImage, prompt, objectImages, combinedImage = null) {
  try {
    console.log('🚀 Iniciando geração com IA')
    console.log('📝 Prompt:', prompt)
    console.log('🖼️ Base image length:', baseImage.length)
    console.log('🎭 Mask image length:', maskImage.length)
    console.log('📎 Object images count:', objectImages.length)
    console.log('🔗 Combined image:', combinedImage ? 'Yes (' + combinedImage.length + ')' : 'No')

    const baseImageBlob = dataUrlToBlob(baseImage)
    const maskImageBlob = dataUrlToBlob(maskImage)

    console.log('🔍 Base image blob:', {
      mimeType: baseImageBlob.mimeType,
      dataLength: baseImageBlob.data.length
    })
    console.log('🔍 Mask image blob:', {
      mimeType: maskImageBlob.mimeType,
      dataLength: maskImageBlob.data.length
    })

    // Validação básica dos dados
    if (!baseImageBlob.data || baseImageBlob.data.length < 100) {
      throw new Error('Base image data is invalid or too small')
    }
    if (!maskImageBlob.data || maskImageBlob.data.length < 100) {
      throw new Error('Mask image data is invalid or too small')
    }

    const objectImageParts = objectImages.map(img => {
      const blob = dataUrlToBlob(img.url)
      return {
        inlineData: {
          data: blob.data,
          mimeType: blob.mimeType,
        },
      }
    })

    // Monta as partes para envio
    const parts = []

    // Se temos imagem combinada, enviamos duas imagens com contexto claro
    if (combinedImage) {
      const combinedImageBlob = dataUrlToBlob(combinedImage)

      parts.push(
        { text: `Analise estas duas imagens. A primeira é a imagem original atual. A segunda mostra a mesma imagem com a área destacada em verde que deve ser modificada.

${prompt}

IMPORTANTE: Modifique APENAS a área marcada em verde da segunda imagem, mantendo o resto exatamente igual à imagem original.` },
        {
          inlineData: {
            data: baseImageBlob.data,
            mimeType: baseImageBlob.mimeType,
          },
        },
        {
          inlineData: {
            data: combinedImageBlob.data,
            mimeType: combinedImageBlob.mimeType,
          },
        }
      )
    } else {
      // Método antigo para compatibilidade
      parts.push(
        { text: prompt },
        {
          inlineData: {
            data: baseImageBlob.data,
            mimeType: baseImageBlob.mimeType,
          },
        }
      )
    }

    // Adiciona imagens de referência
    parts.push(...objectImageParts)

    // Adiciona máscara se não estamos usando imagem combinada
    if (!combinedImage) {
      parts.push({
        inlineData: {
          data: maskImageBlob.data,
          mimeType: maskImageBlob.mimeType,
        },
      })
    }

    console.log('📡 Enviando requisição para Gemini API...')

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image-preview',
      contents: { parts },
      config: {
        responseModalities: [Modality.IMAGE, Modality.TEXT],
      },
    })

    console.log('✅ Resposta recebida da API')
    console.log('📋 Response structure:', {
      candidates: response.candidates?.length,
      hasParts: response.candidates?.[0]?.content?.parts?.length
    })

    let newImage = null
    let newText = null

    for (const part of response.candidates[0].content.parts) {
      console.log('🔍 Processing part:', { hasInlineData: !!part.inlineData, hasText: !!part.text })
      if (part.inlineData) {
        newImage = part.inlineData.data
        console.log('🖼️ Image found, length:', newImage?.length)
      }
      if (part.text) {
        newText = part.text
        console.log('📝 Text found:', newText?.substring(0, 100))
      }
    }

    if (!newImage) {
      console.error('❌ API did not return an image')
      throw new Error("API did not return an image.")
    }

    console.log('✅ Geração concluída com sucesso')
    return { image: newImage, text: newText }

  } catch (error) {
    console.error("Error calling Gemini API:", error)

    // Tratamento específico para erros da API
    if (error.message && error.message.includes('INVALID_ARGUMENT')) {
      throw new Error(`Erro de formato de imagem: A API não conseguiu processar a imagem. Tente com uma imagem menor ou diferente.`)
    }

    if (error.message && error.message.includes('400')) {
      throw new Error(`Erro da API (400): Problema com os dados enviados. Verifique se a imagem e a máscara estão válidas.`)
    }

    if (error instanceof Error) {
      throw new Error(`Failed to generate image: ${error.message}`)
    }
    throw new Error("An unknown error occurred while generating the image.")
  }
}
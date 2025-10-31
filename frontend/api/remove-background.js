/**
 * Vercel Serverless Function - 背景去除 API 代理
 * 支持 300 秒超时（Pro 计划），足够 302.AI 处理时间
 * 
 * 工作流程：
 * 1. 接收前端的 multipart/form-data 请求
 * 2. 使用 getRawBody 获取原始请求体
 * 3. 转发到 AWS 后端
 * 4. 返回处理结果
 */

import getRawBody from 'raw-body';

const BACKEND_URL = 'http://13.52.175.51:18181';

export default async function handler(req, res) {
  // 处理 CORS 预检请求
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    return res.status(200).end();
  }

  // 只允许 POST 请求
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const startTime = Date.now();
  console.log('📤 [Serverless] 收到背景去除请求');

  try {
    // 获取原始请求体（包含 multipart/form-data）
    const rawBody = await getRawBody(req);
    console.log(`📊 [Serverless] 请求体大小: ${rawBody.length} bytes`);

    // 构建目标 URL
    const targetUrl = `${BACKEND_URL}/api/remove-background`;
    console.log(`🎯 [Serverless] 转发到: ${targetUrl}`);

    // 使用 node-fetch 转发到后端
    const fetch = (await import('node-fetch')).default;
    
    const response = await fetch(targetUrl, {
      method: 'POST',
      headers: {
        'Content-Type': req.headers['content-type'], // 包含 boundary
        'Content-Length': rawBody.length.toString(),
      },
      body: rawBody,
      // 不设置 timeout，让 Vercel 的 maxDuration 控制
    });

    const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
    console.log(`📥 [Serverless] 后端响应: HTTP ${response.status} (耗时 ${elapsed}s)`);

    // 获取响应数据
    const contentType = response.headers.get('content-type');
    
    // 设置响应头
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    
    if (contentType?.includes('application/json')) {
      const data = await response.json();
      console.log(`✅ [Serverless] 处理成功: ${data.processed_url}`);
      return res.status(response.status).json(data);
    } else {
      const text = await response.text();
      return res.status(response.status).send(text);
    }

  } catch (error) {
    const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
    console.error(`❌ [Serverless] 错误 (${elapsed}s):`, error.message);
    
    return res.status(500).json({ 
      error: '代理请求失败', 
      detail: error.message,
      elapsed: `${elapsed}s`
    });
  }
}

// Vercel API 配置
export const config = {
  api: {
    bodyParser: false, // 禁用自动解析，使用 raw-body 手动处理
    responseLimit: false, // 允许大响应
  },
};


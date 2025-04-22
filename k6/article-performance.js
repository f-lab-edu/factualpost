import http from 'k6/http';
import { check, sleep } from 'k6';
import { htmlReport } from 'https://raw.githubusercontent.com/benc-uk/k6-reporter/main/dist/bundle.js';

export const options = {
    vus: 800,
    duration: '30s',
    thresholds: {
        http_req_duration: ['p(95)<500'],
    },
};

const BASE_URL = 'http://localhost:4445/article';

function getRandomInRange(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

let userLikes = {}; // 사용자별 좋아요 상태 저장

function like(articleId, userId) {
    const url = `${BASE_URL}/${articleId}/like`;
    const headers = { 
                        'Content-Type': 'application/json',
                        'X-User-Id': userId.toString()
                    };
    const res = http.put(url, null, { headers });

    check(res, {
        'like status 200': (r) => r.status === 200,
    });

    if (res.status === 200) {
        if (!userLikes[userId]) {
            userLikes[userId] = new Set();
        }
        userLikes[userId].add(articleId);
    } else {
        console.log(`Like Error: ${res.status}, ${res.body}`);
    }
}

function unlike(articleId, userId) {
    if (userLikes[userId] && userLikes[userId].has(articleId)) {
        const url = `${BASE_URL}/${articleId}/like`;
        const headers = { 
                            'Content-Type': 'application/json',
                            'X-User-Id': userId.toString()
                        };
        const res = http.del(url, null, { headers });

        check(res, {
            'unlike status 200': (r) => r.status === 200,
        });

        if (res.status === 200) {
            userLikes[userId].delete(articleId);
        } else {
            console.log(`Unlike Error: ${res.status}, ${res.body}`);
        }
    }
}

export default function () {
    const ARTICLE_ID_MIN = 349708;
    const ARTICLE_ID_MAX = 1200000;
    const USER_ID_MAX = 1000;

    const articleId = getRandomInRange(ARTICLE_ID_MIN, ARTICLE_ID_MAX);
    const userId = getRandomInRange(1, USER_ID_MAX);

    if (Math.random() < 0.5) {
        like(articleId, userId);
    } else {
        unlike(articleId, userId);
    }

    sleep(1);
}

export function handleSummary(data) {
    return {
        'result.html': htmlReport(data),
    };
}
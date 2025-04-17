import http from 'k6/http';
import { check, sleep } from 'k6';
import { htmlReport } from 'https://raw.githubusercontent.com/benc-uk/k6-reporter/main/dist/bundle.js';

export const options = {
    vus: 30, // 동시 사용자 수
    duration: '30s', // 테스트 지속 시간
    thresholds: {
        http_req_duration: ['p(95)<500'], // 95%의 요청은 500ms 이하로 완료
    },
};
const BASE_URL = 'http://localhost:4445/user/sign-up'; // sign-up API URL

function getNextUserId() {
    return `noh${200000 + __VU * 1000 + __ITER}`; // VU와 반복(iteration)을 조합하여 고유 ID 생성
}

function signUp(userId, password) {
    const url = BASE_URL;
    const payload = JSON.stringify({
        userId: userId,
        password: password,
    });

    const headers = { 'Content-Type': 'application/json' };

    const res = http.post(url, payload, { headers });

    console.log(`Response: ${res.status} - ${res.body}`); // 응답 확인

    let responseBody;
    try {
        responseBody = res.json(); // JSON 응답이면 자동 변환
    } catch (e) {
        responseBody = null; // JSON 변환 실패 시 null
    }

    check(res, {
        'status is 201': (r) => r.status === 201,
        'message contains successful': (r) => responseBody && responseBody.message && responseBody.message.includes('sign-up successful'),
    });

    return res;
}

export default function () {
    const userId = getNextUserId(); // 각 VU에 고유한 ID 생성
    const password = 'thisispassword!';
    console.log(userId, password);
    signUp(userId, password);

    sleep(1); // 1초 대기
}

// k6 실행 후 HTML 리포트 생성
export function handleSummary(data) {
    return {
        'result.html': htmlReport(data),
    };
}

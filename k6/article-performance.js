import http from "k6/http";
import { check, sleep } from "k6";
import { Trend } from "k6/metrics";

import { htmlReport } from "https://raw.githubusercontent.com/benc-uk/k6-reporter/main/dist/bundle.js";

export function handleSummary(data) {
    return {
    "summary.html": htmlReport(data),
    };
}

const dataReceivedTrend = new Trend("data_received_size", true);

export const options = {
    scenarios: {
        gradual_rps_test: {
            executor: "ramping-arrival-rate",
            startRate: 50,
            timeUnit: "1s",
            preAllocatedVUs: 500,
            maxVUs: 800,
            stages: [
                { target: 100, duration: "30s" }, // 30초 동안 100 RPS로 증가
                { target: 300, duration: "30s" }, // 30초 동안 300 RPS로 증가
                { target: 500, duration: "1m" },  // 1분 동안 500 RPS 유지
                { target: 0, duration: "30s" },   // 30초 동안 종료
            ],
        },
    },
    thresholds: {
        http_req_failed: [{ threshold: "rate<0.05" }],
        http_req_duration: [{ threshold: "p(95)<3000" }],
    },
};

export default function () {
    const BASE_URL = "http://localhost:4445";
    const ACCESS_TOKEN = "";

    const cursors = [117545782, 110653214, 98445622, 15664819, 64855119];
    const cursor = cursors[Math.floor(Math.random() * cursors.length)];

    const keyword = "";
    const startDate = "2024-01-01";
    const endDate = "2025-01-01";
    const sortOrder = "DESC";
    
    const url = `${BASE_URL}/article?cursor=${cursor}&keyword=${keyword}&startDate=${startDate}&endDate=${endDate}&sortOrder=${sortOrder}`;
    
    const response = http.get(
        url,
        {
            headers: {
                "Authorization": `Bearer ${ACCESS_TOKEN}`,
                "Content-Type": "application/json",
            },
            timeout: "60s",
            tags: { name: "get_articles" },
        },
    );

    if (response.body) dataReceivedTrend.add(response.body.length);

    check(response, {
        "status is 200": (r) => r.status === 200,
        "response is not empty": (r) => r.body.length > 0,
    });

    sleep(1);
}

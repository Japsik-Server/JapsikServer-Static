// semver.min.js 로드
const script = document.createElement('script');
script.src = 'https://rawgit.com/hippich/bower-semver/master/semver.min.js';
document.head.appendChild(script);

script.onload = function () {
    // Github repository info
    const repoOwner = 'Japsik-Server'; // Github Repository Owner
    const repoName = 'JapsikLauncher'; // Repository Name

    // API endpoint URL
    const apiUrl = `https://api.github.com/repos/${repoOwner}/${repoName}/tags`;

    // API 호출
    fetch(apiUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            console.log(data); // API 응답을 콘솔에 출력
            // Tag 정보 파싱
            const tags = data.map(tag => tag.name);

            // Latest 버전 및 Pre-release Latest 버전 추출
            const latestStable = getLatestStable(tags).replace('v', '');
            const latestDev = getLatestDev(tags).replace('v', '');

            // HTML에 결과 표시
            document.getElementById('stableLatest').textContent = latestStable;
            document.getElementById('devLatest').textContent = latestDev;

            // 내려받기 버튼 클릭 이벤트 핸들러
            document.getElementById("stableDownload").onclick = function() {
                showConfirmation(latestStable, 'exe');
            }; 
        
            document.getElementById("devDownload").onclick = function() {
                showConfirmation(latestDev, 'exe');
            }; 
        })
        .catch(error => console.error('Error fetching data:', error));
};

// Latest Stable 버전 추출 함수
function getLatestStable(tags) {
    // Semantic Versioning에 따라 정렬
    tags.sort((a, b) => {
        return semver.compare(b, a);
    });

    // Latest Stable 버전 찾기
    for (const tag of tags) {
        if (!tag.includes('-')) {
            return tag;
        }
    }

    // Stable 버전이 없는 경우
    return 'N/A';
}

// Latest Pre-release 버전 추출 함수
// Latest Pre-release 버전 추출 함수
function getLatestDev(tags) {
    let latestDev = null;

    for (const tag of tags) {
        if (tag.includes('-')) {
            if (!latestDev || semver.lt(latestDev, tag)) {
                latestDev = tag;
            }
        }
    }

    // Pre-release 버전이 없는 경우
    return latestDev ? latestDev : 'N/A';
}

function showConfirmation(version, extension) {
    Swal.fire({
        title: '소프트웨어 사용권 안내',
        html: 'JapsikServer™ Launcher는 <b><a href="https://japsik.xyz" target="_blank">JapsikServer™</a></b> 및 JapsikServer™ 제반 서비스에서만 사용하실 수 있습니다. ' +
          '공개된 자료를 무단으로 수정, 배포, 또는 복제하는 행위는 민·형사상의 책임을 수반할 수 있습니다.<br> ' +
          '또한 이 소프트웨어는 어떠한 보증이 제공되지 않으며, 사용 도중 발생한 문제에 대하여 JapsikServer에서는 책임지지 않습니다. ' +
          '이에 동의하시나요?',
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: '동의하고 내려받기',
        cancelButtonText: '취소',
    }).then((result) => {
        if (result.isConfirmed) {
            var downloadUrl = "https://github.com/Japsik-Server/JapsikLauncher/releases/download/v" + version + "/Japsik-Launcher-setup-" + version + "." + extension;
            Swal.fire({
                title: '다운로드가 시작되었습니다.',
                html: '다운로드가 자동으로 시작되지 않는다면 <u><a href="' + downloadUrl + '">이곳을 누르세요</a></u>.',
                icon: 'success',
                confirmButtonText: '확인',
            });
            window.location.href =  downloadUrl;
        }
    });
}
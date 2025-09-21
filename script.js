document.addEventListener('DOMContentLoaded', () => {
    const channelsGrid = document.getElementById('channels-grid');
    const videoPlayerContainer = document.getElementById('video-player-container');
    const videoPlayer = document.getElementById('video-player');
    const closePlayerBtn = document.getElementById('close-player');
    const searchBar = document.getElementById('search-bar');
    let allChannels = []; 

    // आपकी GitHub रिपॉजिटरी से डेटा लोड करने के लिए कॉन्फ़िगरेशन
    const githubUser = 'yfk123-code';
    const repoName = 'tv';
    const filePath = 'channels.json';

    const jsonUrl = `https://raw.githubusercontent.com/${githubUser}/${repoName}/main/${filePath}`;

    // GitHub से चैनल डेटा फ़ेच करें
    fetch(jsonUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok. Status: ' + response.status);
            }
            return response.json();
        })
        .then(data => {
            allChannels = data;
            displayChannels(allChannels);
        })
        .catch(error => {
            console.error('Error fetching channel data:', error);
            channelsGrid.innerHTML = '<p style="color: #ccc;">चैनल लोड करने में विफल। कृपया सुनिश्चित करें कि आपकी GitHub रिपॉजिटरी पब्लिक है और channels.json फ़ाइल मौजूद है।</p>';
        });

    // पेज पर चैनलों को दिखाने का फंक्शन
    function displayChannels(channels) {
        channelsGrid.innerHTML = ''; 
        channels.forEach(channel => {
            const channelCard = document.createElement('div');
            channelCard.className = 'channel-card';

            const innerCard = document.createElement('div');
            innerCard.className = 'channel-card-inner';
            
            innerCard.innerHTML = `
                <img src="${channel.logo}" alt="${channel.name}" onerror="this.style.display='none'; this.parentElement.insertAdjacentHTML('afterbegin', '<div class=\'placeholder-logo\'>${channel.name.charAt(0)}</div>');">
                <div class="channel-name">${channel.name}</div>
            `;

            channelCard.appendChild(innerCard);
            
            channelCard.addEventListener('click', () => {
                playChannel(channel.url);
            });
            channelsGrid.appendChild(channelCard);
        });
    }

    // चैनल प्ले करने का फंक्शन
    function playChannel(streamUrl) {
        videoPlayerContainer.style.display = 'flex';
        document.body.style.overflow = 'hidden';

        if (Hls.isSupported()) {
            const hls = new Hls();
            hls.loadSource(streamUrl);
            hls.attachMedia(videoPlayer);
            hls.on(Hls.Events.MANIFEST_PARSED, () => {
                videoPlayer.play();
            });
        } else if (videoPlayer.canPlayType('application/vnd.apple.mpegurl')) {
            videoPlayer.src = streamUrl;
            videoPlayer.addEventListener('loadedmetadata', () => {
                videoPlayer.play();
            });
        }
    }

    // वीडियो प्लेयर बंद करें
    closePlayerBtn.addEventListener('click', () => {
        videoPlayerContainer.style.display = 'none';
        videoPlayer.pause();
        videoPlayer.src = "";
        document.body.style.overflow = 'auto';
    });

    // सर्च फंक्शन
    searchBar.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase();
        const filteredChannels = allChannels.filter(channel => 
            channel.name.toLowerCase().includes(searchTerm)
        );
        displayChannels(filteredChannels);
    });
});
const getPostsUrl = 'https://x8ki-letl-twmt.n7.xano.io/api:dhE7PJXl:v1/posts';

const getPosts = async () => {
    const results = await fetch(getPostsUrl).then(x => x.json());
    return results;
};

const render = (posts) => {
    const postsDiv = document.getElementById('blog-posts');
    postsDiv.textContent = '';

    for(const post of posts){
        const el = document.createElement('div');
        el.classList.add('column');
        el.innerHTML = `
        <a class="picture" href="../features/blog1.html"
            style="background-image:url(../assets/pawdental.jpg)">
        </a>

        <div class="title">${post.title}</div>

        <div>
            <p class="p-content">${post.body}</p>
        </div>
        `;
        postsDiv.append(el);
    }
};

(async() => {
    const posts = await getPosts();
    render(posts);
})();

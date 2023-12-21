const $ = document
let template = $.createElement("template")

template.innerHTML = `
    <link rel="stylesheet" href="../components/latest-course/latest-course.css">
    <div class="latest__course">
    <a class="latest__course--img"><img></a>
    <div class="latest__course--body">
        <div class="latest___course--basin"><slot name="basin"></slot></div>
        <div class="shit">
            <h4 class="latest__course--title"><slot name="title"></slot></h4>
            <div class="latest__course--details"><slot name="details"></slot></div>
        </div>
        <div class="latest__course--info">
            <div class="latest__course--teacher">
                <div class="latest__course--teacher--name"><svg fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6"><path stroke-linecap="round" stroke-linejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" /></svg><slot name="t-name"></slot></div>
                <div class="latest__course--duration"><svg fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6"><path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" /></svg><slot name="duration"></slot></div>
            </div>
            <div class="latest__course--rate"><slot name="rate"></slot><svg fill="#F9A134" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6"><path stroke-linecap="round" stroke-linejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" /></svg></div>
        </div>
        <div class="latest__course--footer">
            <div class="latest__course--footer--users"><svg fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6"><path stroke-linecap="round" stroke-linejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" /></svg><slot name="users"></slot></div>
            <div class="latest__course--cost"><slot name="cost"></slot></div>
        </div>
    </div>
    </div>
`

class LatestCourses extends HTMLElement {
    constructor() {
        super()
        this.attachShadow({ mode: "open" })
        this.shadowRoot.append(template.content.cloneNode(true))
    }
    connectedCallback() {
        this.shadowRoot.querySelector(".latest__course--img img").src = this.getAttribute("img-src")
    }
}

export { LatestCourses }
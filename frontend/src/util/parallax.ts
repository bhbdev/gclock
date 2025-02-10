// Function to create a parallax effect on an element
// @arg scrn: string - selector to which screen to apply the parallax effect
// @arg elem: string - child scrn selector of the element to apply the parallax effect
// @arg strength: number - strength of the parallax effect
//
// This particular effect has a perspective rotation effect on the element
// The element rotates on the x and y axis based on the mouse position

export function parallax(scrn: string, elem: string, strength?: number) {
    //if mobile, return
    if (window.innerWidth < 800) return;
    const element = document.querySelector(`${scrn} ${elem}`) as HTMLElement;
    if (!element) return;
    
    const movementStrength = strength || 15;

    function transforms(x: number, y: number, el: HTMLElement) {
        const box = el.getBoundingClientRect();
        const calcX = -(y - box.y - (box.height / 2)) / movementStrength;
        const calcY = (x - box.x - (box.width / 2)) / movementStrength;
        
        return "perspective(100px) "
        + "   rotateX("+ calcX +"deg) "
        + "   rotateY("+ calcY +"deg)";
    };

    function transformElement(el: HTMLElement, xyEl: [number, number, HTMLElement]) {
        el.style.transform  = transforms(...xyEl);
    }

    if (!scrn) scrn = 'body';
    const screenElement = document.querySelector(scrn) as HTMLElement;
    if (!screenElement) return;

    screenElement.addEventListener('mousemove', function(e) {
        const xy = [e.clientX, e.clientY];
        const position: [number, number, HTMLElement] = [xy[0], xy[1], element];

        window.requestAnimationFrame(function(){
        transformElement(element, position);
        });
    });

    screenElement.addEventListener('mouseleave', function() {
        element.style.transform = 'rotateX(0deg) rotateY(0deg)';
        element.style.perspectiveOrigin = '50% 50%';
    });

}
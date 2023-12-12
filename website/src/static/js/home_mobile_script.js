function onOpenClick(event) {

    var ripple = document.createElement('div');
    ripple.className = 'ripple';

    // Set the position of the ripple element
    var rect = event.target.getBoundingClientRect();
    var x = event.clientX - rect.left;
    var y = event.clientY - rect.top;
    ripple.style.left = x + 'px';
    ripple.style.top = y + 'px';

    // Append the ripple element to the button
    event.target.appendChild(ripple);

    // Remove the ripple element after the animation is complete
    setTimeout(function() {
        ripple.remove();
    }, 600);

    var overlay = document.getElementsByClassName("home-overlay-form-container")[0];
    overlay.style.display = "block"; // Show the element

}

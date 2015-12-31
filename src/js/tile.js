document.addEventListener('DOMContentLoaded', function() {
    function handleClick() {
        this.classList.toggle('smaller');
    }

    var sections = document.getElementsByTagName('section');
    for (var i = 0; i < sections.length; i++) {
        sections[i].addEventListener('click', handleClick);
    }
});

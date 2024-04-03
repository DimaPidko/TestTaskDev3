document.addEventListener('DOMContentLoaded', () => {
    const input = document.getElementById('textInput');
    const button = document.getElementById('applyButton');
    const output = document.getElementById('output');
    var isCtrlPressed = false;
    var selectedContainers = [];
    var offsetX, offsetY;

    function isContainerInSelectionRange(container, range) {
        const containerRange = document.createRange();
        containerRange.selectNodeContents(container);
        return range.intersectsNode(container);
    }

    function applyButton() {
        output.innerHTML = '';
        const text = input.value;
        for (let i = 0; i < text.length; i++) {
            const charContainer = document.createElement('span');
            charContainer.textContent = text[i];
            output.appendChild(charContainer);
        }
    }

    function mouseUpOutput() {
        if (isCtrlPressed) {
            const selection = window.getSelection();
            const selectedText = selection.toString();
            console.log(selectedText);
            if (selectedText !== '') {
                const range = selection.getRangeAt(0);

                selectedContainers = [];
                const containers = document.querySelectorAll('#output > *');
                containers.forEach((container) => {
                    if (isContainerInSelectionRange(container, range)) {
                        container.classList.add('selected');
                        selectedContainers.push(container);
                    } else {
                        container.classList.remove('selected');
                    }
                });
            }
        }
    }

    button.addEventListener('click', applyButton);

    output.addEventListener('mouseup', mouseUpOutput);

    output.addEventListener('mousedown', (event) => {
        if (event.target.classList.contains('selected')) {
            offsetX = event.target.getBoundingClientRect().left - event.clientX;
            offsetY = event.target.getBoundingClientRect().top - event.clientY;
            event.target.isDragging = true;
        }
    });

    document.addEventListener('mousemove', (event) => {
        if (selectedContainers.length > 0) {
            selectedContainers.forEach((container) => {
                if (container.isDragging) {
                    container.style.left = event.clientX + container.offsetX + 'px';
                    container.style.top = event.clientY + container.offsetY + 'px';
                }
            });
        }
    });

    document.addEventListener('mouseup', (event) => {
        if (selectedContainers.length > 0) {
            selectedContainers.forEach((container) => {
                if (container.isDragging) {
                    container.isDragging = false;
                    container.style.left = event.clientX + offsetX + 'px';
                    container.style.top = event.clientY + offsetY + 'px';
                }
            });
        }
    });

    document.addEventListener('keydown', (event) => {
        if (event.key === 'Control') {
            isCtrlPressed = true;
        }
    });
    document.addEventListener('keyup', (event) => {
        if (event.key === 'Control') {
            isCtrlPressed = false;
        }
    });
});

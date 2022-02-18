
    // dinamic files  in laravel project
    // var nameFile = '<?= $files ?>';
    // const url = 'https://website.com.br/painel/storage/materials/'+nameFile+'#toolbar=0';
    const url = 'https://ilearn.marist.edu/access/lessonbuilder/item/172134/group/e0d1b466-ea21-433b-8926-c41f19455217/Course%20Materials/SamplePDF.pdf'
    let pdfDoc = null,
      pageNum = 1,
      pageIsRendering = false,
      pageNumIsPending = null;

    var scale = 1.5;
    const canvas = document.querySelector('#pdf-render')
    const ctx = canvas.getContext('2d');




    // Render the page
    const renderPage = num => {
      pageIsRendering = true;

      // Get page
      pdfDoc.getPage(num).then(page => {
        // Set scale
        const viewport = page.getViewport({ scale });
        canvas.height = viewport.height;
        canvas.width = viewport.width;

        const renderCtx = {
          canvasContext: ctx,
          viewport
        };

        page.render(renderCtx).promise.then(() => {
          pageIsRendering = false;

          if (pageNumIsPending !== null) {
            renderPage(pageNumIsPending);
            pageNumIsPending = null;
          }
        });

        // Output current page
        document.querySelector('#page-num').textContent = num;
      });
    };

    // Check for pages rendering
    const queueRenderPage = num => {
      if (pageIsRendering) {
        pageNumIsPending = num;
      } else {
        renderPage(num);
      }
    };

    // Show Prev Page
    const showPrevPage = () => {
      if (pageNum <= 1) {
        return;
      }
      pageNum--;
      queueRenderPage(pageNum);
    };

    // Show Next Page
    const showNextPage = () => {
      if (pageNum >= pdfDoc.numPages) {
        return;
      }
      pageNum++;
      queueRenderPage(pageNum);
    };

    // Get Document
    pdfjsLib
      .getDocument(url)
      .promise.then(pdfDoc_ => {
        pdfDoc = pdfDoc_;

        document.querySelector('#page-count').textContent = pdfDoc.numPages;

        renderPage(pageNum);
      })
      .catch(err => {
        // Display error
        const div = document.createElement('div');
        div.className = 'error';
        div.appendChild(document.createTextNode(err.message));
        document.querySelector('body').insertBefore(div, canvas);
        // Remove top bar
        document.querySelector('.control-bar').style.display = 'none';
      });

    // Button Events
    document.querySelector('#prev-page').addEventListener('click', showPrevPage);
    document.querySelector('#next-page').addEventListener('click', showNextPage);

    // zoom page
    function zoom_in(){
        if(scale <= 4){
            document.querySelector(".canva-pdf").style.maxWidth = "unset";
            scale += 0.5;
            renderPage(pageNum); 
        }
        
    }

    function zoom_out(){
        if (scale > 1.5) {
            scale -= 0.5;
            renderPage(pageNum);
        }
        if(scale == 1.5){
            document.querySelector(".canva-pdf").style.maxWidth = "100%";
            renderPage(pageNum)
        }
    }

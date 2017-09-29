let imgUrl=''

function runCart() {
    let clickOne=true
    let clickShowCart=true
    let idProducts=[]
    let existId=[]



    let id=1

    checkForError()


    takeLastIdAfterRefresh()

    $('#addProduct').click(addProduct)

    $('#createProduct').click(createProduct)
    $('#imgShopping').click(showShoppingCart)
    $('#clearCart').click(clearCart)
    $('#totalSum').click(totalSumProducts)


    $("#product").hide()
    $('#Editproduct').hide()

    renderProducts()

    function totalSumProducts() {
        if(clickOne==true){
            $('#total').append($('<div>')
                .append('<h3>').text('subtotal:')
                .append($('<input id="subtotalValue" type="number">'))
                .append($('<label>').text('in this sum include 5%tax for shopping'))
                .append($('<h2>').text('total sum:').append('<label id="finalSumProducts">'))
                .append($('<a href="#" class="btn-info">[calculate]</a>')
                    .click(totalSumAllProductsInCart))
            )
        }
        clickOne=false
    }

    function totalSumAllProductsInCart() {
        var productsInShoppingCartId = JSON.parse(sessionStorage.getItem('shoppingCart'));

        let quantityProducts=[]

        for ( var i = 0, len = localStorage.length; i < len; ++i ) {
            let product = JSON.parse(localStorage.getItem(localStorage.key(i)));

            let key = localStorage.key(i)

            if ('product' + product.idProduct == key) {
                for (let a = 0; a < productsInShoppingCartId.length; a++) {
                    if(product.idProduct==productsInShoppingCartId[a]){
                        quantityProducts.push(product.quantity)
                    }
                }
            }
        }

        let totalSum=0

        let subtotal= $('#subtotalValue').val()

        for (let i = 0; i < quantityProducts.length; i++) {
            totalSum=totalSum+( Number(quantityProducts[i])*subtotal)
        }

        $('#finalSumProducts').text(totalSum-(totalSum*0.05))

    }

    function clearCart() {

        sessionStorage.clear()
        $('#productsInShoppingCart').remove()
    }

    function showShoppingCart() {


        if(clickShowCart==true){
            var productsIdInCart = JSON.parse(sessionStorage.getItem('shoppingCart'));




            for ( var i = 0, len = localStorage.length; i < len; ++i ) {
                let product = JSON.parse(localStorage.getItem(localStorage.key(i)));





                for (let a = 0; a < productsIdInCart.length; a++) {

                    if(productsIdInCart[a]==product.idProduct){
                        console.log(product.idProduct)

                        $('#productsInShoppingCart').append($("<div  id='"+'productShoppingCartDelete'+product.idProduct+"'></div>").append(
                            $('<div>').append($('<label>').text('title:')).append($('<div>').text(product.title)),
                            $('<div>').append($('<label>').text('description:')).append($('<div>').text(product.description)),
                            $('<div>').append($('<label>').text('quantity')).append($('<div>').text(product.quantity))
                                .append($('<a href="#" class="btn btn-danger">[Remove product]</a>')
                                    .click(removeProductFromShowCart.bind(this,product.idProduct)))


                            )
                        )






                    }
                }



            }


            clickShowCart=false

        }



    }

    function removeProductFromShowCart(id) {
        let removeProductFromSession = JSON.parse(sessionStorage.getItem('shoppingCart'));

        removeProductFromSession = removeProductFromSession.filter(item => item !== id)

        sessionStorage.setItem('shoppingCart', JSON.stringify(removeProductFromSession));

        let removeProduct='productShoppingCartDelete'+id

        $("#" + removeProduct).remove()


    }

    function addProduct() {
        $("#product").show()
    }

    function renderProducts() {
        $('#renderProducts').empty()
        if (localStorage.length === 0) {
            $('#renderProducts').text('Няма налични продукти')
        }

        let arrUrlPick=[]

        for ( var i = 0, len = localStorage.length; i < len; ++i ) {
            let product= JSON.parse(localStorage.getItem( localStorage.key( i ) ) );

            let keyToString= localStorage.key(i).toString()

            let nameKey=keyToString.substring(0,7)

            if(nameKey=='product'){
                let id=product.idProduct

                let imgUrl=product.img

                arrUrlPick.push(product)

                $('#renderProducts').append($('<div>').append(
                    $('<div>').append($('<label>').text('id:')).append($('<div>').text(product.idProduct)),
                    $('<div>').append($('<label>').text('title:')).append($('<div>').text(product.title)),
                    $('<div>').append($('<label>').text('description:')).append($('<div>').text(product.description)),
                    $('<div>').append($('<label>').text('quantity')).append($('<div>').text(product.quantity)),
                    $('<div>').append("<br><canvas  id='"+'img'+product.idProduct+"'></canvas><br>")
                        .append($('<a href="#" class="btn btn-danger">[Delete]</a>')
                            .click(deleteProduct.bind(this,id)))
                        .append($('<a href="#" class="btn-info">[Edit]</a>')
                            .click(editProduct.bind(this,id)))
                        .append($('<a href="#" class="btn-success">[addInCart]</a>')
                            .click(addProductInShopingCart.bind(this,id)))
                    )
                )

                for (let i = 0; i < arrUrlPick.length; i++) {
                    let variable=0

                    let canvas='canvas'+i
                    let context='contex' +i
                    let base_image='base_imabe'+i

                    canvas  = document.getElementById(`${'img'+arrUrlPick[i].idProduct}`),
                        context = canvas.getContext('2d');

                    make_base();

                    function make_base()
                    {
                        canvas.width=200
                        canvas.height=200

                        base_image = new Image();
                        base_image.src = arrUrlPick[i].img
                        base_image.onload = function(){
                            context.drawImage(base_image, 0,0);
                        }
                    }
                }

            }

        }

        function addProductInShopingCart(idProduct) {

            idProducts.push(idProduct)

            $('#existProduct').text('')

            if(existId.includes(idProduct)){

                $('#existProduct').addClass('bg-danger').text('product is already in your card').fadeOut(2000);

                return
            }

            existId.push(idProduct)

            let arrUrlProductInCart=[]

            let uniqueIdInCart = Array.from(new Set(idProducts))

            window.sessionStorage.shoppingCart = JSON.stringify(uniqueIdInCart);

            var obj1 = JSON.parse(sessionStorage.getItem('shoppingCart'));

            for ( var i = 0, len = localStorage.length; i < len; ++i ) {
                let product = JSON.parse(localStorage.getItem(localStorage.key(i)));

                let key=localStorage.key(i)

                arrUrlProductInCart.push(product)

                if('product'+ idProduct==key) {

                    let productInCart= JSON.parse(localStorage.getItem(key))



                    $('#productsInShoppingCart').append($("<div  id='"+'productInCartRemove'+product.idProduct+"'></div>").append(
                        $('<div>').append($('<label>').text('title:')).append($('<div>').text(product.title)),
                        $('<div>').append($('<label>').text('quantity')).append($('<div>').text(product.quantity)),
                        $('<div>').append("<br><canvas width='200px' height='200px' id='"+'imgInCart'+product.idProduct+"'></canvas><br>")
                            .append($('<a href="#" class="btn btn-danger">[Remove product]</a>')
                                .click(removeProductFromCart.bind(this,product.idProduct)))

                        )
                    )


                    for (let i = 0; i < arrUrlProductInCart.length; i++) {

                        let variable=0

                        let canvas='canvas'+i
                        let context='contex' +i
                        let base_image='base_imabe'+i

                        canvas  = document.getElementById(`${'imgInCart'+idProduct}`),
                            context = canvas.getContext('2d');



                        make_base();

                        function make_base()
                        {

                            canvas.width=200
                            canvas.height=200

                            base_image = new Image();
                            base_image.src = arrUrlProductInCart[i].img
                            base_image.onload = function(){
                                context.drawImage(base_image, 0, 0);
                            }
                        }
                    }

                }

            }

            function removeProductFromCart(id) {

                let removeProductFromSession = JSON.parse(sessionStorage.getItem('shoppingCart'));

                removeProductFromSession = removeProductFromSession.filter(item => item !== id)

                sessionStorage.setItem('shoppingCart', JSON.stringify(removeProductFromSession));

                let removeProduct='productInCartRemove'+id

                $("#" + removeProduct).remove()


            }

        }

        function editProduct(idProduct) {
            for ( var i = 0, len = localStorage.length; i < len; ++i ) {
                let product = JSON.parse(localStorage.getItem(localStorage.key(i)));

                let key=localStorage.key(i)

                if('product'+ idProduct==key){

                    $('#product').hide()

                    let editProduct= JSON.parse(localStorage.getItem(key))

                    let img=editProduct.img

                    let state={
                        id:idProduct,
                        imgage:img
                    }

                    $('#EditSection')
                        .append($('<h1>').text('Edit Form'))
                        .append($('<form>')
                            .append($('<div>').text('title')
                                .append($('<div>')
                                    .append($('<input id="editTitle">').val(editProduct.title))
                                )

                            )
                            .append($('<div>').text('description')
                                .append($('<div>')
                                    .append($('<input id="editDescription">').val(editProduct.description))
                                )

                            )
                            .append($('<div>').text('quantity')
                                .append($('<div>')
                                    .append($('<input id="editQuantity" type="number">').val(editProduct.quantity))
                                )

                            )
                        )
                        .append($('<a href="#" class="btn btn-info">[Edit]</a>')
                            .click(editFormProduct.bind(this,state)))
                }

            }
            function editFormProduct(state) {


                $('#editInfo').text('success edit!!!')



                let editTitleForm=$('#editTitle').val()
                let editDescriptionForm=$('#editDescription').val()
                let editQuantityForm=$('#editQuantity').val()

                let editData={
                    idProduct:state.id,
                    title:editTitleForm,
                    description:editDescriptionForm,
                    quantity:editQuantityForm,
                    img:state.imgage

                }
                localStorage.setItem('product'+state.id,JSON.stringify(editData))

                renderProducts()
            }

        }

        function deleteProduct(idProduct) {
            for ( var i = 0, len = localStorage.length; i < len; ++i ) {
                let product = JSON.parse(localStorage.getItem(localStorage.key(i)));

                let key=localStorage.key(i)

                if('product'+ idProduct==key){

                    window.localStorage.removeItem(key);

                    renderProducts()

                }
            }
        }

    }

    function createProduct() {

        $('#title').css("border-color", "");
        $('#titleError').empty()

        $('#description').css("border-color", "");
        $('#descriptionError').empty()

        $('#quantity').css("border-color", "");
        $('#quantityError').empty()


        if( $('#title').val()=='' || $('#description').val()=='' || $('#quantity').val()==''){

            $('#fillForm').text('please fill the form')

        }


        if($('#title').val().length<3||$('#title').val().length>=250){
            $('#title').css("border-color", "red");
            $('#titleError').text('title must be between 3 and 250 symbols')
            return
        }

        if($('#description').val().length<5||$('#description').val().length>=500){
            $('#description').css("border-color", "red");
            $('#descriptionError').text('description must be between 5 and 500 symbols')
            return
        }



        if($('#quantity').val().length<1){
            $('#quantity').css("border-color", "red");
            $('#quantityError').text('quantity must be more from 1 symbol')
            return
        }

        var imageName = $('#imageinput').val()

        var imgSize = document.getElementById("imageinput").files[0];

        if (imgSize.size > 3145728)
        {
            $('#imgError').text('image cannot be more from 3 mb')
            return
        }

        let last3Digits = imageName.substr(imageName.length - 3)


        if(last3Digits=='png'||last3Digits=='jpg'){
            console.log('png r jpg')
        }else{
            'ne e'
            $('#imgError').text('only jpg,png format')
            return
        }


        $('#createdProduct').text('created product').fadeOut(2000)


        $("#product").submit(function(e) { e.preventDefault() });

        let title=$('#title').val().trim()
        let description=$('#description').val().trim()
        let quantity=$('#quantity').val().trim()

        if(title.length<=3 || title.length>=250){
            $('#title').css("border-color", "red");
            $('#titleError').text('Името трябва да е между 3 и 250 символа')
            return
        }

        if(description.length<=5 || description.length>=500){

            $('#description').css("border-color", 'red');
            $('#descriptionError').text('Описанието трябва да бъде между 5 и 500 символа')
            return
        }

        if($('#quantity').val()<1){
            $('#quantity').css("border-color", "red");
            $($('#quantityError').text('количеството не може да бъде по малко от 1'))
            return
        }

        let products='product' + id

        let obj={

            title:title,
            description:description,
            quantity:quantity,
            img:imgUrl,
            idProduct:id

        }

        let product=JSON.stringify(obj)

        localStorage.setItem(products, product);

        id=id+1

        renderProducts()
    }

    function takeLastIdAfterRefresh() {
        for ( var i = 0, len = localStorage.length; i < len; ++i ) {
            let product = JSON.parse(localStorage.getItem(localStorage.key(i)));

            let keyToString = localStorage.key(i).toString()

            let nameKey = keyToString.substring(0, 7)

            if (nameKey == 'product') {

                let idLast = JSON.parse(localStorage.getItem(localStorage.key(localStorage.length-1)))

                id=idLast.idProduct+1

            }

        }
    }

    function checkForError() {
        let checkErrorNull = JSON.parse(sessionStorage.getItem('shoppingCart'));

        if (sessionStorage.length == 0){
            return
        }
        else{
            for (let i = 0; i <checkErrorNull.length; i++) {
                if(checkErrorNull[i]==null){
                    sessionStorage.clear()
                    localStorage.clear()
                }
            }
        }

    }

}

function renderCanvas(event) {

    var myImage = URL.createObjectURL(event.target.files[0]);

    var myCanvas = document.getElementById('mycanvas');
    var ctx = myCanvas.getContext('2d');
    var img = new Image();
    img.onload = function(){

        myCanvas.width = 150;
        myCanvas.height = 150;

        ctx.drawImage(img, 0, 0);

        imgUrl=myCanvas.toDataURL('image/jpeg')

    };

    img.src = URL.createObjectURL(event.target.files[0]);

}

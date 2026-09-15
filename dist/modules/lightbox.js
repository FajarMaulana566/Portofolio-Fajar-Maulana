export function openLightbox(button){
 const dialog=document.createElement('dialog');dialog.className='image-lightbox';dialog.setAttribute('aria-label',button.dataset.alt||'Foto proyek');
 const close=document.createElement('button');close.className='close-dialog';close.type='button';close.textContent='✕';close.setAttribute('aria-label','Tutup foto');
 const img=document.createElement('img');img.src=button.dataset.lightbox;img.alt=button.dataset.alt||'Foto proyek';img.decoding='async';
 const caption=document.createElement('p');caption.textContent=img.alt;dialog.append(close,img,caption);document.body.append(dialog);dialog.showModal();
 close.onclick=()=>dialog.close();dialog.addEventListener('click',e=>{if(e.target===dialog)dialog.close();});dialog.addEventListener('close',()=>{dialog.remove();button.focus();},{once:true});
}

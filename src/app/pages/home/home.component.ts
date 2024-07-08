import { Component, ElementRef, HostListener, OnInit, Renderer2, WritableSignal, computed, effect, signal } from '@angular/core'
import { LoginComponent } from '../../components/login/login.component'
import { Traveller } from '../../models/Traveller.model'
import { AppstoreService } from '../../shared/appstore.service'
import { CommonModule } from '@angular/common'
import { BookingGestionComponent } from '../../components/booking-gestion/booking-gestion.component'

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    LoginComponent,
    BookingGestionComponent,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit{
  constructor(private renderer: Renderer2, private el: ElementRef, private appstore: AppstoreService) {}

  traveller: WritableSignal<Traveller> = this.appstore.getTraveller()
  showLogin: boolean = false
  clickCount: number = 0
  timerId: any = null
  
  numberResize = signal<number>(0)
  landingPageImage = signal<HTMLImageElement | null>(null)
  // imageHeight = computed(() => this.landingPageImage() ? this.landingPageImage()?.offsetHeight : 0)
  
  //landingPageImage ne change plus une fois que la page est chargée
  // donc pour que imageHeight se mette à jour lorsque la fenêtre change de taille, il faut également le compute avec un autre signal
  // d'ou cette utilisation de numberResize
  imageHeight = computed(() => this.landingPageImage()!.offsetHeight + this.numberResize() - this.numberResize())

  ngOnInit(): void {
      this.scrollEffect()
  }

  onImageLoad(event: any): void {
    this.updateImageHeight()
  }
  
  //on écoute l'évênement de changement de taille de la fenêtre pour toujours mettre à jour la hauteur de l'image
  @HostListener('window:resize', ['$event'])
  onResize(event: Event) {
    this.numberResize.update(value => value + 1)
    this.updateImageHeight()
    // this.onWindowScroll(event)        
  }
  
  @HostListener('window:scroll', ['$event'])
  onWindowScroll(event: Event) {
    const landingPage = this.el.nativeElement.querySelector('#landingPage')
    const landingPageImage = this.el.nativeElement.querySelector('#landingPage img')
    const imageHeight = landingPageImage.offsetHeight
    let scrollPosition = window.scrollY

    this.renderer.setStyle(landingPage,'height', imageHeight - scrollPosition + "px")
  }
  
  scrollEffect(): void {
    this.renderer.listen('window', 'scroll', (event) => {
      const landingPage = this.el.nativeElement.querySelector('#landingPage')
      const nuage = this.el.nativeElement.querySelector('#nuage')
      let scrollPosition = window.scrollY
      const maxScrollLandingImage = 100
      const maxScrollNuage = 50      
  
      if(scrollPosition <= maxScrollLandingImage){
        this.renderer.setStyle(landingPage, 'top', -scrollPosition + 'px')
      } else {
        this.renderer.setStyle(landingPage, 'top', -maxScrollLandingImage + 'px')
      }
  
      if(scrollPosition <= maxScrollNuage){
        this.renderer.setStyle(nuage, 'bottom', scrollPosition + 'px')
      } else {
        this.renderer.setStyle(nuage, 'bottom', maxScrollNuage + 'px')
      }
    })
  }
  
  updateImageHeight() :void {
    this.landingPageImage.set(this.el.nativeElement.querySelector('#landingPage img'))    
    const openImageSection = this.el.nativeElement.querySelector('.openImage')
    this.renderer.setStyle(openImageSection,'height', this.imageHeight() + 'px')    
  }
  
  closeLogin(): void {
    this.showLogin = false
  }
  
  onClickSeveralTimes() {
    this.clickCount++
    if (this.clickCount === 1) {
      this.timerId = setTimeout(() => {
        this.clickCount = 0 // Réinitialiser le compteur après 5 secondes
      }, 5000)
    }
    if (this.clickCount >= 5) {
      this.showLogin = true
      this.clickCount = 0 // Réinitialiser le compteur
      clearTimeout(this.timerId) // Annuler le setTimeout
    }
  }

}

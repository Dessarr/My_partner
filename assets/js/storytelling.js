// Storytelling Engine with Parallax Background
// Click navigation system with smooth transitions

// State management
let currentSection = 0;
let currentText = 0;
let isScrolling = false;
let tutorialDone = false;
let started = false;
let mode = "scroll"; // "scroll" | "story"
let currentLine = 0;
let typing = false;
let isTransitioning = false;
let typingCompleted = false;
// Flags untuk kontrol animasi dan interaksi di last-parallax
let lastParallaxAnimRunning = false; // sedang animasi grow-in
let lastParallaxAnimDone = false;    // animasi grow-in selesai

// Get all sections
const sections = document.querySelectorAll('.section');
let texts = sections[currentSection] ? sections[currentSection].querySelectorAll('.text') : [];

// Story mode elements - will be initialized after DOM loads
let textBox, textElement, fadeOverlay, floatingBackButton, loader;

// Story lines for section1
const section1StoryLines = [
    "Oke, pertama gini Zum…",
    "Gua sebenernya nggak expect bisa dapet rekan sekbid yang sespesial lu itu. Atau… lu jadi spesial karena gua suka/cinta sama lu?",
    "I know ini terdengar aneh/freak? but indeed this is also my confession to you...",
    "okey gua akan coba ceritain semuanya. Di malam pas dibagiin seksi bidang dari angkatan 26 ke 27, I was expecting anyone to be my partner, and it was you",
    "For the first time we met, maybe sorry, I didn't pay a lot of attention to you. Karena mungkin kita belum banyak kenal satu sama lain waktu itu. Tapi satu hal yang gua baru sadar...",
    "kita tuh udah sering ketemu. Bukan ketemu secara langsung ngobrol, tapi kayak di foto-foto OSIS atau moment bersama, lu tuh selalu di samping atau depan gua. Always close.",
    "Dan ternyata kita satu frekuensi banget (atau cuma gua aja yang ngerasa begitu?).",
    "Awal-awal lu chat gua buat nentuin siapa ketua pelaksana classmeet pertama… haha, gua masih inget banget itu. Terus waktu berlalu gitu aja. Dan satu hal lagi yang gua notice...",
    "kita nggak pernah satu sie kepanitiaan di awal periode jadi junior. Baru akhir-akhir ini pas jadi senior. Apakah segacor itu kita makanya seksi bidang 7 (lu sama gua) harus dipisah biar sie kepanitiaannya rata kerjanya? wkwkwkwk",

];

// Story lines for section2
const section2StoryLines = [
    "Gua juga masih inget the day you asked me for a ride home. Surprisingly, rumah kita searah, walaupun rumah gua jauh banget. Kayaknya itu abis Foren atau apa gitu di gedung F, terus hujan dan banjir.",
    "And you asked me for a ride. I still remember karena gang rumah lu banjir dan minta gua drop di depan gang aja. Tapi tetap gua terobos banjirnya, nyamperin lu sampai rumah. Kayaknya ada orang tua lu yang nunggu di depan pagar rumah juga. Dan setelah itu, gua pulang.",
    "Tapi tau nggak? Nggak lama, motor gua mati. Dan itu masih di gang lu, udah agak jauh. Yang polisi tidur gede itu, jalanannya rusak parah.",
    "Tapi dari situ, I started to see you as my partner. As a special person in my life.",
    "Setelah itu kalau kita ngumpul di rumah Angel, kita selalu bareng satu motor. Dan waktu berjalan… kita makin sering bareng. Pernah sampai malam juga. Kita pulang bareng.",
    "Dan ini bukan nyalahin siapa-siapa ya, serius. Tapi I still remember your words. u said,",
    { speaker: "azumi", text:"Kalau bareng Ann dan Angel, kadang gua selalu merasa jadi nyamuk."}, 
    "That hits me deep down. And I didn't want you to feel like that in any situation. Karena lu partner gua, gua mau dan akan kasih banyak effort buat lu setelah malam itu.",
    "Mungkin cerita ini agak acak, tapi yang sekarang gua ceritain yang pengen gua ceritain dan masih gua coba untuk ingat.",
];

// Story lines for section3
const section3StoryLines = [
    "Dari awal, gua selalu mau kasih effort lebih ke lu. Gak tau kenapa. Mungkin cara kita berinteraksi bikin gua ngerasa kayak gitu, cara lu selalu deket gua di diskusi, pas ngumpul, trus gua masih inget u punching my left hand like a punching bag.",
    "I still remember how fast I reply to your chat whenever you messaged me. And you said I was like a ai bot. LOL.",
    "Pas classmeet, wah, kita makin deket. Jokes kita:",
    { speaker: "dual", text: "'Ytta' (yang tujuh-tujuh aja)"},
    "dan lu manggil gua Eggman, hahaha. Juga our inside joke tentang suicide karena pressure dari OSIS dan classmeet xD.",
];

// Story lines for section4
const section4StoryLines = [
    "Gua masih inget, sehari sebelum ulang tahun lu, gua lagi iseng buka Instagram. Ada fitur ngasih tahu ulang tahun dan tanpa sengaja gua klik, dan malah langsung ngirim DM: Happy Birthday. Gua panik. Terus lu bales,",
    { speaker: "azumi", text: "'BLOM. Masih besok.'"}, 
    "Gua segitu awalnya sampai salah hari.",
    "Dari situ gua tahu tanggal ulang tahun lu. Gua siapin long text pertama di chat kita. Gua inget apa yang gua tulis, dan lu bales kayak:",
    { speaker: "azumi", text: "we should make them feel jealous when they see our bond." },
    "Kalimat itu bikin gua kasih semua effort gua buat bonding sama lu. Buat jaga lu. Buat buktiin lu partner gua. Gua juga bilang, kalau mau nebeng pulang lagi juga nggak apa-apa karena rumah kita searah gak usah sungkan.",
];

// Story lines for section5
const section5StoryLines = [
    "Dan ternyata kita sefrekuensi banget, sampai jadi dewan kedisiplinan juga bareng. Walaupun sekarang kita benci peran itu karena alumni sialan itu wkwkwkw.",
    "I really felt our bond at Gonat. Maybe because on the way to Gonat, I sat next to you in the tronton.",
    "You lent me your guitar for the whole day and night. Cara kita ngobrol bikin gua ngerasa dihargai.",
    "Gua bahkan marah ke Noval di jalan pulang, gak tahu dia ragebait atau nggak.",
    "Gua chat lu terus biar nemenin lu jauh dari dia. Besoknya gua ajak lu sekolah bareng. Karena si noval bilang sesuatu di rest area and i got mad at him. Besoknya lagi, gua minta maaf karena udah ikut campur soal Noval padahal gua nggak punya hak.",
];

// Story lines for section6
const section6StoryLines = [
    "Sejak itu… Zum, gap di antara kita kerasa banget. You getting further. Gua tahu gua salah. Makanya pas deeptalk angkatan sebelum regenerasi 27, gua minta maaf dan bawa topik itu lagi.",
    "Meskipun lu udah maafin, tapi jarak kita tuh nyata. Mungkin dari awal cuma ekspektasi gua yang ketinggian. Gua minta maaf. Maaf udah kegeeran, udah ngerasa kita sedeket itu.",
];

// Story lines for section7
const section7StoryLines = [
    "Setelah itu kerasa banget lu kayak menghindar.",
    "Tapi tetep balik ke gua tiap butuh bantuan. Dan gua masih bantu. Situasi naik turun. Kita deket kalau ada job, dan jauh banget kalau nggak ada urusan.",
    "Gua masih inget, sehari sebelum 17 Agustus kita beli kue jauh banget, trus fotbar, makan gacoan, dan lu kayaknya kepedesan wkwkwk. Kita juga sempet ngobrolin angkatan, terus potbar lagi pas pulangnya.",
    "AHH, i really want to tell all the story, but i’m trying to remember it all..."
];

// Story lines for section8
const section8StoryLines = [
    "OH YEAH—kita punya kemeja warna dan coraknya mirip. Bahkan kadang gua mau dresscode kita sama mulu. Gua bahkan pernah nebak-nebak: “Hari ini dia pake baju apa ya? Kemeja coklat biru nggak ya?” Kadang salah, kadang bener. Tapi fun fact, mayoritas baju kita sama itu pilihan/dipilihin emak gua. KEK???"
];
// Story lines for section9
const section9StoryLines = [
    "Soal Tiara… Mungkin gua salah bawa ini di long text tentang lu. Tapi gua mau jujur semua. Dia kelihatan deket banget pas gua nyalon ketua OSIS. Tapi itu cuma sebatas teman. Dia emang suka ngobrol, dan gua suka dengerin. Emangnya salah punya teman ngobrol? wkwkwk. Tapi gua heran OSIS sama yang lain pada cie-ciein. Kayak… bro??",
    "Oke skip.",
];

// Story lines for section10
const section10StoryLines = [
    "Gua gak bisa marah ke lu, Zum. Mentok-mentok, gua diem aja. Gua gak mau nunjukin kekesalan gua ke lu.",
    "Tapi gua cukup kaget pas lu blok gua di WhatsApp. Trus tiba-tiba muncul-muncul lagi.",
    "Gua udah coba berkali-kali buat ngilangin perasaan ini. Bahkan sempat ada gap 1-2 bulan pas PKL, kita gak interaksi sama sekali.",
    "Tapi sekali ketemu lagi… ya it keeps showing up. Sorry kalau di akhir periode, performa gua di OSIS menurun. Karena alasan gua effort tuh lu. Kalau lu dan gua ada gap… yaudah, gua cuma pengen kelarin aja masa OSIS sampai selesai.",
    "It feels like you’re manipulating me or something. You keep disappearing when I needed you the most, but appearing when you need me.",
    "I know that pattern. And dumb me, I just keep following it karena gua gak mau lu marah...",
    "And that's what i felt, i really dont want to point this out but idk what to do...",
];

// Story lines for section11
const section11StoryLines = [
    "Gua masih inget, pas banjir itu kalau nggak salah banjirnya cukup gede di daerah sana, trus gua bikin/upload foto ayah gua main PS di WhatsApp channel, trus lu reply:",
    {speaker: "azumi", text: "Enak masih ada listrik."},
    "Itu sebenernya gua udah liat, Zum. Tapi gua sengaja coba, “Nih kalau gua balesnya lama gimana?” Karena kadang lu bales besoknya hehe no offense (but deepdown i dont want to blame you, i know that you have thing you have to face first), atau malah nggak bales.",
    "Tapi malamnya, gua mau bales… lu hapus pesannya. Rasanya kayak lu marah ke gua.",
    "Pas senior juga persiapan konsep SK 2. Gua tahu lu block nomor gua karena gua nggak bantu. Gua nya yang komen tentang anak SK 2 bukannya bantu, tapi at that time I was very busy kumpulin duit,",
    "kerja dan gua pun akan muncul kalau di-tag dan pasti bantu. Banyak momen pas angkatan kita sharing/diskusi di rumah Angel, gua milih diem. Banyak momen diskusi, gua diem. Karena pendapat gua bertolak belakang. Dan gua gak mau debat. Gak mau ribut. Sama kalian.",
    "Sama lu. Gua lebih milih ikut aja.",
];

// Story lines for section12
const section12StoryLines = [
    "Gua bahkan pernah pengen buat surat ini pas Famigos-nya Ann yang ada konsep surat rahasia.",
    "Tapi ya… kondisi kita udah naik turun. Dan akhirnya Famigos-nya cuma ke daerah Lagoon.",
    "Gua pengen dapet hadiah dari lu. Dan gua juga harap lu dapet hadiah dari gua karena kita punya interest yang sama: rubik, lego, random stuff…",
    "Speaking of LEGO gua ambil magang demi bisa jalan bareng lu ke LEGO Sumrec. Gua siapin duitnya karena gua pengen beliin elu. Tapi ternyata nggak pernah jalan.",
    "Dan sekarang kita udah ada jarak(?) akhirnya ya, gitu. and i was at my lowest i think when u said u got a bf at ur wa channel",
    "Its almost end of my letters, and disclaimer, jangan diambil hati kalau my POV di sini berbeda dengan kenyataanya apa yang lu hadepin, gua support terus.",
    "Even at my anger state i still want to support you, gua akan tetep berusaha cari maksud dari tindakan lu, gak semerta merta dari Pov gua doang.",
    "Last but not least, gua really appreciate all the moments we had together. All the memories we shared. All the laughs we had. All the tears we cried. All the support we gave each other. All the love we shared. I love you, Zum.",
];

// Function to get story lines for a section
function getStoryLines(sectionIndex) {
    switch(sectionIndex) {
        case 3: return section1StoryLines; // section1 is index 3
        case 4: return section2StoryLines; // section2 is index 4
        case 5: return section3StoryLines; // section3 is index 5
        case 6: return section4StoryLines; // section4 is index 6
        case 7: return section5StoryLines; // section5 is index 7
        case 8: return section6StoryLines; // section6 is index 8
        case 9: return section7StoryLines; // section7 is index 9
        case 10: return section8StoryLines; // section8 is index 10
        case 11: return section9StoryLines; // section9 is index 11
        case 12: return section10StoryLines; // section10 is index 12
        case 13: return section11StoryLines; // section11 is index 13
        case 14: return section12StoryLines; // section12 is index 14
        default: return [];
    }
}

// Get parallax elements
let homeH2 = document.querySelector('.home-parallax h2');
let mountain1 = document.getElementById("mountain1");
let mountain2 = document.getElementById("mountain2");
let mountain3 = document.getElementById("mountain3");
let mountain4 = document.getElementById("mountain4");
let homeBulan = document.getElementById("home-bulan");
let mountainCloseDepan = document.getElementById("mountain-close-depan");
let mountainCloseBelakang = document.getElementById("mountain-close-belakang");
let homeHuman = document.getElementById("home-human");
let homePohon = document.getElementById("home-pohon");
let homePohon1 = document.getElementById("home-pohon-1");
let homePohon2 = document.getElementById("home-pohon-2");
let homePohon3 = document.getElementById("home-pohon-3");
let homePohon4 = document.getElementById("home-pohon-4");
let homePohon5 = document.getElementById("home-pohon-5");
let rock = document.getElementById("rock");
let homeGradienPalingBelakang = document.getElementById("home-gradien-paling-belakang");
let homeGradienTengah = document.getElementById("home-gradien-tengah");
let homeGradienPalingDepan = document.getElementById("home-gradien-paling-depan");

// Get surga section elements
let matahariSurga = document.getElementById("matahari-surga");
let gunungSurgaBelakang = document.getElementById("gunung-surga-belakang");
let gunungSurgaTengah = document.getElementById("gunung-surga-tengah");
let gunungSurgaDepan = document.getElementById("gunung-surga-depan");
let awanSurgaBase = document.getElementById("awan-surga-base");
let gateSurga = document.getElementById("gate-surga");
let awanSurgaKiri = document.getElementById("awan-surga-kiri");
let awanSurgaKanan = document.getElementById("awan-surga-kanan");

// Helper function for cleaner movement
function move(el, x, y) {
    if (el) {
        // Get existing transform and preserve it
        let existingTransform = el.style.transform || '';
        let baseTransform = '';
        
        // Extract base transforms (like translate(-50%, -50%) for centering)
        if (existingTransform.includes('translate(-50%, -50%)')) {
            baseTransform = 'translate(-50%, -50%) ';
        } else if (existingTransform.includes('translateX(-50%)')) {
            baseTransform = 'translateX(-50%) ';
        }
        
        el.style.transform = `${baseTransform}translate(${x}px, ${y}px)`;
    }
}

// Helper function for opacity
function setOpacity(el, opacity) {
    if (el) {
        el.style.opacity = opacity;
        el.style.transition = 'opacity 0.3s ease';
    }
}

// Text animation functions
function showText(sectionIndex, textIndex) {
    const currentSectionElement = sections[sectionIndex];
    if (!currentSectionElement) return;
    
    const texts = currentSectionElement.querySelectorAll('.text');
    if (texts.length === 0) return;
    
    console.log(`showText called: section ${sectionIndex}, text ${textIndex}, total texts: ${texts.length}`);
    
    texts.forEach((t, i) => {
        t.classList.remove('active');
        if (i === textIndex) {
            t.classList.add('active');
            console.log(`Text ${i} activated: "${t.textContent}"`);
        }
    });
}

function hideAllTexts() {
    document.querySelectorAll('.text').forEach(t => t.classList.remove('active'));
}

// Typing animation function
function typeLine(line, callback) {
    if (!textElement) return;
    typing = true;
    typingCompleted = false;
    
    // Set textbox to typing state
    if (textBox) {
        textBox.classList.remove('ready');
        textBox.classList.add('typing');
    }
    
    textElement.textContent = "";
    let i = 0;
    const interval = setInterval(() => {
        textElement.textContent += line[i];
        i++;
        if (i >= line.length) {
            clearInterval(interval);
            typing = false;
            // Add a small delay after typing completes
            setTimeout(() => {
                typingCompleted = true;
                
                // Set textbox to ready state
                if (textBox) {
                    textBox.classList.remove('typing');
                    textBox.classList.add('ready');
                }
                
                if (callback) callback();
            }, 300); // 300ms delay after typing completes
        }
    }, 40);
}

// Story mode functions
function showNextStoryLine() {
    if (typing) return;
    const storyLines = getStoryLines(currentSection);
    
    if (currentLine < storyLines.length) {
        const currentStoryLine = storyLines[currentLine];
        
        // Handle different data structures
        let textToType;
        let speakerName = "Dessar"; // Default speaker
        
        if (typeof currentStoryLine === 'object' && currentStoryLine.speaker) {
            // Object with speaker and text
            textToType = currentStoryLine.text;
            speakerName = currentStoryLine.speaker;
        } else {
            // String (default Dessar)
            textToType = currentStoryLine;
        }
        
        // Update speaker name
        const speakerElement = document.getElementById('speakerName');
        if (speakerElement) {
            if (speakerName === "dual") {
                // Dual speaker display
                speakerElement.className = "dual";
                speakerElement.innerHTML = `
                    <span class="speaker dessar">Dessar</span>
                    <span class="speaker-separator">&</span>
                    <span class="speaker azumi">Azumi</span>
                `;
            } else {
                // Single speaker display
                speakerElement.textContent = speakerName;
                speakerElement.className = speakerName === "azumi" ? "azumi" : "";
            }
        }
        
        typeLine(textToType, () => {
            // Typing completed callback
            typingCompleted = true;
        });
        currentLine++;
    } else {
        // Story selesai -> tunggu click untuk transisi ke section berikutnya
        // Tidak langsung fade out, tetap di story mode
        typingCompleted = true;
        
        // Set textbox to ready state when story is finished
        if (textBox) {
            textBox.classList.remove('typing');
            textBox.classList.add('ready');
        }
        
        // Special case for section12 - keep textbox visible for click to continue
        if (currentSection === 14) { // section12 is at index 14
            // Keep textbox visible, user can click to continue to last parallax
            return;
        }
        
        // Reset currentLine for next section
        currentLine = 0;
        return;
    }
}

// Generic function to handle transition to story mode section
function transitionToStorySection(targetSectionIndex) {
    isTransitioning = true;
    
    // Fade-in hitam
    if (fadeOverlay) {
        fadeOverlay.style.opacity = 1;
    }
    
    setTimeout(() => {
        // Update current section
        currentSection = targetSectionIndex;
        currentText = 0;
        
        // Scroll to target section
        const targetY = sections[currentSection].offsetTop;
        
        smoothScrollTo(targetY, 4000).then(() => {
            // After scroll is complete, start story mode
            mode = "story";
            currentLine = 0;
            typingCompleted = false; // Reset typing completion flag
            if (textBox) {
                textBox.style.display = "block";
                textBox.classList.remove('ready', 'typing'); // Reset textbox state
            }
            if (floatingBackButton) floatingBackButton.style.display = "flex";
            if (fadeOverlay) fadeOverlay.style.opacity = 1;
            
            // Reset speaker name to default
            const speakerElement = document.getElementById('speakerName');
            if (speakerElement) {
                speakerElement.textContent = "Dessar";
                speakerElement.className = "";
                speakerElement.innerHTML = "Dessar";
            }
            
            setTimeout(() => {
                if (fadeOverlay) fadeOverlay.style.opacity = 0;
                isTransitioning = false; // End transition
                showNextStoryLine();
            }, 800);
        });
    }, 1000);
}

// Function to handle transition from surga to section1
function finishSurgaSection() {
    isTransitioning = true;
    if (fadeOverlay) fadeOverlay.style.opacity = 1;
    
    setTimeout(() => {
        // Show loader
        if (loader) loader.style.display = "block";
        
        // Hide text box and floating button during transition
        if (textBox) textBox.style.display = "none";
        if (floatingBackButton) floatingBackButton.style.display = "none";
        
        // Wait for loader animation (5 seconds)
        setTimeout(() => {
            // Hide loader
            if (loader) loader.style.display = "none";
            
            // Scroll to section1 (index 3)
            currentSection = 3;
            currentText = 0;
            
            // Scroll to target section
            const targetY = sections[currentSection].offsetTop;
            
            smoothScrollTo(targetY, 4000).then(() => {
                // After scroll is complete, start story mode
                mode = "story";
                currentLine = 0;
                typingCompleted = false; // Reset typing completion flag
                if (textBox) {
                    textBox.style.display = "block";
                    textBox.classList.remove('ready', 'typing'); // Reset textbox state
                }
                if (floatingBackButton) floatingBackButton.style.display = "flex";
                
                // Reset speaker name to default
                const speakerElement = document.getElementById('speakerName');
                if (speakerElement) {
                    speakerElement.textContent = "Dessar";
                    speakerElement.className = "";
                    speakerElement.innerHTML = "Dessar";
                }
                
                // Direct fade out without delay
                if (fadeOverlay) fadeOverlay.style.opacity = 0;
                isTransitioning = false; // End transition
                showNextStoryLine();
            });
        }, 5000); // Wait for loader animation to complete
    }, 1000);
}

// Function to handle transition from section1 back to surga
function finishSection1ToSurga() {
    isTransitioning = true;
    
    // Hide text box and floating button first
    if (textBox) textBox.style.display = "none";
    if (floatingBackButton) floatingBackButton.style.display = "none";
    
    // Fade-in hitam
    if (fadeOverlay) {
        fadeOverlay.style.opacity = 1;
    }
    
    setTimeout(() => {
        // Update current section to surga
        currentSection = 2; // surga is index 2 (0-based)
        currentText = 0;
        
        // Scroll to surga
        const targetY = sections[currentSection].offsetTop;
        
        smoothScrollTo(targetY, 4000).then(() => {
            // After scroll is complete, fade out and show surga text
            if (fadeOverlay) fadeOverlay.style.opacity = 1;
            
            setTimeout(() => {
                if (fadeOverlay) fadeOverlay.style.opacity = 0;
                mode = "scroll"; // Reset to scroll mode
                isTransitioning = false; // End transition
                showText(currentSection, currentText);
            }, 800);
        });
    }, 1000);
}

// Function to handle transition from section12 to last parallax
function transitionToLastParallax() {
    isTransitioning = true;
    
    // Hide text box and floating button immediately (no fade overlay)
    if (textBox) textBox.style.display = "none";
    if (floatingBackButton) floatingBackButton.style.display = "none";
    
    // Find last parallax section (should be the last section with class "last-parallax")
    const lastParallaxSection = document.querySelector('.last-parallax');
    if (lastParallaxSection) {
        // Get the index of last parallax section
        const allSections = document.querySelectorAll('.section');
        let lastParallaxIndex = -1;
        for (let i = 0; i < allSections.length; i++) {
            if (allSections[i] === lastParallaxSection) {
                lastParallaxIndex = i;
                break;
            }
        }
        
        if (lastParallaxIndex !== -1) {
            currentSection = lastParallaxIndex;
            currentText = 0;
            // Siapkan animasi grow-in untuk elemen last-parallax dan nonaktifkan parallax JS
            lastParallaxAnimRunning = true;
            lastParallaxAnimDone = false;
            const ids = ['awan-last','bulan-last','tumpukan-10','tumpukan-2','tumpukan-3','tumpukan-4','tumpukan-5','tumpukan-6','tumpukan-7','tumpukan-8','tumpukan-9','tumpukan-depan'];
            const lastEls = ids.map(id => document.getElementById(id)).filter(Boolean);
            lastEls.forEach(el => {
                el.classList.remove('grow-anim');
                el.classList.add('grow-start');
            });
            
            // Smooth scroll to last parallax section
            const targetY = lastParallaxSection.offsetTop;
            // Mulai animasi grow-in sinkron dengan durasi scroll
            setTimeout(() => {
                lastEls.forEach(el => {
                    el.classList.add('grow-anim');
                    el.classList.remove('grow-start');
                });
                smoothScrollTo(targetY, 4000).then(() => {
                    // Setelah scroll selesai: tandai animasi selesai, tampilkan teks pertama otomatis
                    lastParallaxAnimRunning = false;
                    lastParallaxAnimDone = true;
                    mode = "scroll";
                    isTransitioning = false; // End transition
                    // Pastikan teks pertama langsung muncul
                    showText(currentSection, 0);
                });
            }, 50);
        }
    }
}

// Function to handle transition from last parallax back to section12
function transitionFromLastParallaxToSection12() {
    isTransitioning = true;
    
    // Find section12 (should be at index 14)
    const section12Element = document.querySelector('.section12');
    if (section12Element) {
        // Set current section to section12
        currentSection = 14; // section12 index
        currentText = 0;
        
        // Smooth scroll to section12
        const targetY = section12Element.offsetTop;
        
        smoothScrollTo(targetY, 4000).then(() => {
            // After scroll is complete, return to scroll mode
            mode = "scroll";
            isTransitioning = false; // End transition
        });
    }
}


// Smooth scroll function
function smoothScrollTo(targetY, duration = 4000) {
    return new Promise((resolve) => {
        isScrolling = true;
        const startY = window.scrollY;
        const distance = targetY - startY;
        const startTime = performance.now();

        function animation(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);

            // Easing function for smooth animation
            const eased = progress < 0.5
                ? 4 * progress * progress * progress
                : 1 - Math.pow(-2 * progress + 2, 3) / 2;

            window.scrollTo(0, startY + distance * eased);

            if (progress < 1) {
                requestAnimationFrame(animation);
            } else {
                isScrolling = false;
                resolve();
            }
        }

        requestAnimationFrame(animation);
    });
}

// Navigation functions
function nextText() {
    if (isScrolling) return;
    
    const currentSectionElement = sections[currentSection];
    if (!currentSectionElement) return;
    
    const texts = currentSectionElement.querySelectorAll('.text');
    
    if (currentText < texts.length - 1) {
        currentText++;
        showText(currentSection, currentText);
    } else {
        // Check if we're finishing a section that should transition to story mode
        if (currentSection === 2) {
            // Surga section -> transition to section1
            finishSurgaSection();
    } else {
        nextSection();
        }
    }
}

function prevText() {
    if (isScrolling) return;
    
    const currentSectionElement = sections[currentSection];
    if (!currentSectionElement) return;
    
    const texts = currentSectionElement.querySelectorAll('.text');
    
    if (currentText > 0) {
        currentText--;
        showText(currentSection, currentText);
    } else {
        // Check if we're going back from a story mode section
        if (currentSection === 3) {
            // Section1 -> back to surga
            finishSection1ToSurga();
        } else if (currentSection === 16) {
            // Last parallax -> back to section12
            transitionFromLastParallaxToSection12();
    } else {
        prevSection();
        }
    }
}

function nextSection() {
    if (currentSection < sections.length - 1) {
        currentSection++;
        currentText = 0;
        const targetY = sections[currentSection].offsetTop;
        
        smoothScrollTo(targetY, 4000).then(() => {
            setTimeout(() => showText(currentSection, currentText), 100);
        });
    }
}

function prevSection() {
    if (currentSection > 0) {
        currentSection--;
        const currentSectionElement = sections[currentSection];
        if (currentSectionElement) {
            const texts = currentSectionElement.querySelectorAll('.text');
            currentText = texts.length - 1;
        }
        const targetY = sections[currentSection].offsetTop;
        
        smoothScrollTo(targetY, 4000).then(() => {
            setTimeout(() => showText(currentSection, currentText), 100);
        });
    }
}

// Surga section parallax function
function updateSurgaParallax(value) {
    // Get surga section to determine when to start parallax
    let surgaSection = document.querySelector('.surga-section');
    if (!surgaSection) return;
    
    let surgaRect = surgaSection.getBoundingClientRect();
    let surgaTop = surgaRect.top + window.scrollY;
    let surgaHeight = surgaSection.offsetHeight;
    
    // Calculate visibility factor for smooth transition
    let visibilityFactor = 1;
    let isInView = false;
    
    // Check if section is approaching or in view (extended range)
    if (surgaRect.top < window.innerHeight * 1.2 && surgaRect.bottom > -window.innerHeight * 0.2) {
        isInView = true;
        
        // Calculate smooth visibility factor
        if (surgaRect.top > 0) {
            // Section is coming into view from bottom
            visibilityFactor = Math.max(0, Math.min(1, (window.innerHeight - surgaRect.top) / (window.innerHeight * 0.6)));
        } else if (surgaRect.bottom < window.innerHeight) {
            // Section is leaving view from top
            visibilityFactor = Math.max(0, Math.min(1, surgaRect.bottom / (window.innerHeight * 0.6)));
        }
    }
    
    // Apply parallax with smooth transition
    if (isInView) {
        // Calculate relative scroll position within surga section
        let relativeScroll = value - surgaTop;
        
        // Apply smooth transition with visibility factor
        let smoothRelativeScroll = relativeScroll * visibilityFactor;
        
        // Matahari surga - slow upward movement (background)
        if (matahariSurga) {
            // Reset transform first to ensure visibility
            matahariSurga.style.transform = 'translate(-50%, -50%)';
            // Then apply parallax movement with smooth transition
            matahariSurga.style.transform = `translate(-50%, -50%) translate(0px, ${smoothRelativeScroll * -0.3}px)`;
            // Add opacity transition
            matahariSurga.style.opacity = Math.max(0.3, visibilityFactor);
        }
        
        // Gunung surga - different speeds for depth effect with smooth transitions
        if (gunungSurgaBelakang) {
            move(gunungSurgaBelakang, 0, smoothRelativeScroll * 0.2); // Slowest
            gunungSurgaBelakang.style.opacity = Math.max(0.5, visibilityFactor);
        }
        if (gunungSurgaTengah) {
            move(gunungSurgaTengah, 0, smoothRelativeScroll * 0.4); // Medium
            gunungSurgaTengah.style.opacity = Math.max(0.7, visibilityFactor);
        }
        if (gunungSurgaDepan) {
            move(gunungSurgaDepan, 0, smoothRelativeScroll * 0.6); // Fastest
            gunungSurgaDepan.style.opacity = Math.max(0.8, visibilityFactor);
        }
        
        // Awan surga - floating effect with smooth transitions
        if (awanSurgaBase) {
            move(awanSurgaBase, 0, smoothRelativeScroll * 0.3);
            awanSurgaBase.style.opacity = Math.max(0.6, visibilityFactor);
        }
        if (awanSurgaKiri) {
            move(awanSurgaKiri, smoothRelativeScroll * -0.1, smoothRelativeScroll * 0.2);
            awanSurgaKiri.style.opacity = Math.max(0.5, visibilityFactor);
        }
        if (awanSurgaKanan) {
            move(awanSurgaKanan, smoothRelativeScroll * 0.1, smoothRelativeScroll * 0.2);
            awanSurgaKanan.style.opacity = Math.max(0.5, visibilityFactor);
        }
        
        // Gate surga - slight movement with smooth transition
        if (gateSurga) {
            move(gateSurga, 0, smoothRelativeScroll * 0.1);
            gateSurga.style.opacity = Math.max(0.7, visibilityFactor);
        }
    } else {
        // Reset positions when not in view
        if (matahariSurga) {
            matahariSurga.style.transform = 'translate(-50%, -50%)';
            matahariSurga.style.opacity = '0.3';
        }
        
        // Reset other elements opacity
        [gunungSurgaBelakang, gunungSurgaTengah, gunungSurgaDepan, 
         awanSurgaBase, awanSurgaKiri, awanSurgaKanan, gateSurga].forEach(el => {
            if (el) el.style.opacity = '0.5';
        });
    }
}

// Last parallax section parallax function
function updateLastParallax(value) {
    // Get last parallax section to determine when to start parallax
    let lastParallaxSection = document.querySelector('.last-parallax');
    if (!lastParallaxSection) return;
    // Nonaktifkan efek parallax naik-turun ketika animasi grow-in berjalan atau sudah selesai
    if (lastParallaxAnimRunning || lastParallaxAnimDone) {
        return;
    }
    
    let lastParallaxRect = lastParallaxSection.getBoundingClientRect();
    let lastParallaxTop = lastParallaxRect.top + window.scrollY;
    let lastParallaxHeight = lastParallaxSection.offsetHeight;
    
    // Calculate visibility factor for smooth transition
    let visibilityFactor = 1;
    let isInView = false;
    
    // Check if section is approaching or in view (extended range)
    if (lastParallaxRect.top < window.innerHeight * 1.2 && lastParallaxRect.bottom > -window.innerHeight * 0.2) {
        isInView = true;
        
        // Calculate smooth visibility factor
        if (lastParallaxRect.top > 0) {
            // Section is coming into view from bottom
            visibilityFactor = Math.max(0, Math.min(1, (window.innerHeight - lastParallaxRect.top) / (window.innerHeight * 0.6)));
        } else if (lastParallaxRect.bottom < window.innerHeight) {
            // Section is leaving view from top
            visibilityFactor = Math.max(0, Math.min(1, lastParallaxRect.bottom / (window.innerHeight * 0.6)));
        }
    }
    
    if (isInView) {
        // Calculate relative scroll position within the section
        let relativeScroll = value - lastParallaxTop;
        let smoothRelativeScroll = relativeScroll * visibilityFactor;
        
        // Get last parallax elements
        let awanLast = document.getElementById('awan-last');
        let bulanLast = document.getElementById('bulan-last');
        let tumpukan10 = document.getElementById('tumpukan-10');
        let tumpukan2 = document.getElementById('tumpukan-2');
        let tumpukan3 = document.getElementById('tumpukan-3');
        let tumpukan4 = document.getElementById('tumpukan-4');
        let tumpukan5 = document.getElementById('tumpukan-5');
        let tumpukan6 = document.getElementById('tumpukan-6');
        let tumpukan7 = document.getElementById('tumpukan-7');
        let tumpukan8 = document.getElementById('tumpukan-8');
        let tumpukan9 = document.getElementById('tumpukan-9');
        let tumpukanDepan = document.getElementById('tumpukan-depan');
        
        // Apply parallax effects with different speeds
        if (awanLast) {
            move(awanLast, 0, smoothRelativeScroll * 0.3);
            awanLast.style.opacity = Math.max(0.6, visibilityFactor);
        }
        if (bulanLast) {
            move(bulanLast, 0, smoothRelativeScroll * 0.5);
            bulanLast.style.opacity = Math.max(0.8, visibilityFactor);
        }
        
        // Tumpukan elements with different parallax speeds (layered effect)
        if (tumpukan10) {
            move(tumpukan10, 0, smoothRelativeScroll * 0.1);
            tumpukan10.style.opacity = Math.max(0.7, visibilityFactor);
        }
        if (tumpukan2) {
            move(tumpukan2, 0, smoothRelativeScroll * 0.2);
            tumpukan2.style.opacity = Math.max(0.7, visibilityFactor);
        }
        if (tumpukan3) {
            move(tumpukan3, 0, smoothRelativeScroll * 0.3);
            tumpukan3.style.opacity = Math.max(0.7, visibilityFactor);
        }
        if (tumpukan4) {
            move(tumpukan4, 0, smoothRelativeScroll * 0.4);
            tumpukan4.style.opacity = Math.max(0.7, visibilityFactor);
        }
        if (tumpukan5) {
            move(tumpukan5, 0, smoothRelativeScroll * 0.5);
            tumpukan5.style.opacity = Math.max(0.7, visibilityFactor);
        }
        if (tumpukan6) {
            move(tumpukan6, 0, smoothRelativeScroll * 0.6);
            tumpukan6.style.opacity = Math.max(0.7, visibilityFactor);
        }
        if (tumpukan7) {
            move(tumpukan7, 0, smoothRelativeScroll * 0.7);
            tumpukan7.style.opacity = Math.max(0.7, visibilityFactor);
        }
        if (tumpukan8) {
            move(tumpukan8, 0, smoothRelativeScroll * 0.8);
            tumpukan8.style.opacity = Math.max(0.7, visibilityFactor);
        }
        if (tumpukan9) {
            move(tumpukan9, 0, smoothRelativeScroll * 0.9);
            tumpukan9.style.opacity = Math.max(0.7, visibilityFactor);
        }
        if (tumpukanDepan) {
            move(tumpukanDepan, 0, smoothRelativeScroll * 1.0);
            tumpukanDepan.style.opacity = Math.max(0.8, visibilityFactor);
        }
    } else {
        // Reset positions when not in view
        let lastParallaxElements = [
            'awan-last', 'bulan-last', 'tumpukan-10', 'tumpukan-2', 'tumpukan-3',
            'tumpukan-4', 'tumpukan-5', 'tumpukan-6', 'tumpukan-7', 'tumpukan-8',
            'tumpukan-9', 'tumpukan-depan'
        ];
        
        lastParallaxElements.forEach(id => {
            let element = document.getElementById(id);
            if (element) {
                element.style.transform = 'translate(0, 0)';
                element.style.opacity = '0.5';
            }
        });
    }
}

// Parallax update function
function updateParallax() {
    let value = window.scrollY;
    
    // Get the height of home section
    let homeSection = document.querySelector('.home-parallax');
    let homeHeight = homeSection ? homeSection.offsetHeight : 1000;
    
    // Background mountains only (vertical movement - downward)
    if (homeH2) move(homeH2, 0, value * -0.9);
    if (mountain1) move(mountain1, 0, value * 0.9);
    if (mountain2) move(mountain2, 0, value * 1.2);
    if (mountain3) move(mountain3, 0, value * 1.3);
    if (mountain4) move(mountain4, 0, value * 1.7);
    
    // Moon (slow downward movement)
    if (homeBulan) move(homeBulan, 0, value * 2);
    
    // Hide elements when scrolling past home section
    if (value > homeHeight * 0.8) {
        let opacity = Math.max(0, 1 - ((value - homeHeight * 0.8) / (homeHeight * 0.2)));
        
        [mountain1, mountain2, mountain3, mountain4, homeBulan, homeH2].forEach(element => {
            setOpacity(element, opacity);
        });
        
        if (homeH2) setOpacity(homeH2, opacity);
    } else {
        [mountain1, mountain2, mountain3, mountain4, homeBulan, homeH2].forEach(element => {
            setOpacity(element, 1);
        });
        
        if (homeH2) setOpacity(homeH2, 1);
    }
    
    // Surga section parallax
    updateSurgaParallax(value);
    
    // Last parallax section parallax
    updateLastParallax(value);
}

// Throttled scroll handler
let ticking = false;
function handleScroll() {
    if (!ticking) {
        requestAnimationFrame(() => {
            updateParallax();
            ticking = false;
        });
        ticking = true;
    }
}

// Click event handlers
function handleClick(e) {
    if (!tutorialDone) return;
    if (isScrolling) return;
    if (isTransitioning) return; // Prevent clicks during transition

    // Klik pertama -> mulai, munculin text pertama
    if (!started) {
        started = true;
        currentText = 0;
        showText(currentSection, currentText);
        return;
    }

    // Handle story mode
    if (mode === "story") {
        const storyLines = getStoryLines(currentSection);
        const isStoryFinished = currentLine >= storyLines.length;
        
        // Check if click is on text box area
        const textBoxRect = textBox ? textBox.getBoundingClientRect() : null;
        const isClickOnTextBox = textBoxRect && 
            e.clientX >= textBoxRect.left && 
            e.clientX <= textBoxRect.right && 
            e.clientY >= textBoxRect.top && 
            e.clientY <= textBoxRect.bottom;
        
        if (isClickOnTextBox) {
            // Click on text box -> progress forward
            if (isStoryFinished) {
                // Story selesai -> transisi ke section berikutnya (hanya jika typing sudah selesai)
                if (typingCompleted) {
                    // Special handling for section12 - transition to last parallax
                    if (currentSection === 14) { // section12 is at index 14
                        transitionToLastParallax();
                        return;
                    }
                    
                    if (currentSection < sections.length - 1) {
                        transitionToStorySection(currentSection + 1);
                    } else {
                        // Section terakhir -> fade out dan kembali ke scroll mode
                        isTransitioning = true;
                        if (fadeOverlay) fadeOverlay.style.opacity = 1;
                        setTimeout(() => {
                            if (textBox) textBox.style.display = "none";
                            if (floatingBackButton) floatingBackButton.style.display = "none";
                            if (fadeOverlay) fadeOverlay.style.opacity = 0;
                            mode = "scroll";
                            isTransitioning = false; // End transition
                        }, 1000);
                    }
                }
            } else {
                // Story belum selesai -> lanjut story (hanya jika typing sudah selesai)
                if (typingCompleted) {
                    showNextStoryLine();
                }
            }
        }
        return;
    }

    // Handle scroll mode
    const middle = window.innerHeight / 2;
    if (e.clientY < middle) {
        // Jika berada di last-parallax, blok navigasi mundur
        const sectionEl = sections[currentSection];
        if (sectionEl && sectionEl.classList.contains('last-parallax')) {
            return;
        }
        prevText();
    } else {
        nextText();
    }
}

// Tutorial overlay
function showTutorial() {
    const tutorial = document.createElement('div');
    tutorial.id = 'tutorial';
    tutorial.innerHTML = `
        <h1>Click to Progress</h1>
        <div id="divider"></div>
        <p>Klik area atas = Scroll ke Atas<br>Klik area bawah = Scroll ke Bawah</p>
        <p>(Klik dimanapun untuk mulai)</p>
    `;
    
    tutorial.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.85);
        color: white;
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
        z-index: 1000;
        text-align: center;
        font-family: 'Inter', sans-serif;
    `;
    
    const divider = tutorial.querySelector('#divider');
    divider.style.cssText = `
        position: absolute;
        top: 50%;
        left: 0;
        width: 100%;
        height: 2px;
        background: white;
        opacity: 0.6;
    `;
    
    document.body.appendChild(tutorial);
    
    tutorial.addEventListener('click', () => {
        tutorial.style.display = 'none';
        tutorialDone = true;
        // Tidak langsung show text, tunggu klik pertama
        console.log('Tutorial closed, waiting for first click');
    });
}

// Initialize everything
document.addEventListener('DOMContentLoaded', () => {
    console.log('Storytelling engine initialized');
    
    // Initialize story mode elements
    textBox = document.getElementById("textbox");
    textElement = document.getElementById("text");
    fadeOverlay = document.getElementById("fadeOverlay");
    floatingBackButton = document.getElementById("floatingBackButton");
    loader = document.getElementById("loader");
    
    // Add scroll event listener for parallax
    window.addEventListener('scroll', handleScroll);
    
    // Add click event listener
    document.body.addEventListener('click', handleClick);
    
    // Add floating back button event listener
    if (floatingBackButton) {
        floatingBackButton.addEventListener('click', (e) => {
            e.stopPropagation();
            if (isTransitioning) return; // Prevent clicks during transition
            
            // Handle back button click
            if (currentSection === 3) {
                // Section1 -> back to surga
                finishSection1ToSurga();
            } else if (currentSection > 3) {
                // Section2-12 -> back to section sebelumnya
                transitionToStorySection(currentSection - 1);
            }
        });
    }
    
    // Show tutorial
    showTutorial();
    
    // Reset to top on refresh
    window.scrollTo(0, 0);
    
    // Check loaded elements
    const homeElements = [
        mountain1, mountain2, mountain3, mountain4, homeBulan, homeH2,
        mountainCloseDepan, mountainCloseBelakang, homeHuman,
        homePohon, homePohon1, homePohon2, homePohon3, homePohon4, homePohon5,
        rock, homeGradienPalingBelakang, homeGradienTengah, homeGradienPalingDepan
    ];
    
    const surgaElements = [
        matahariSurga, gunungSurgaBelakang, gunungSurgaTengah, gunungSurgaDepan,
        awanSurgaBase, gateSurga, awanSurgaKiri, awanSurgaKanan
    ];
    
    const allElements = [...homeElements, ...surgaElements];
    const loadedElements = allElements.filter(el => el !== null);
    console.log(`Loaded ${loadedElements.length} total parallax elements`);
    console.log(`Home elements: ${homeElements.filter(el => el !== null).length}`);
    console.log(`Surga elements: ${surgaElements.filter(el => el !== null).length}`);
    
    // Check story mode elements
    if (textBox && textElement && fadeOverlay) {
        console.log('Story mode elements loaded successfully');
    } else {
        console.log('Story mode elements NOT FOUND!');
        console.log('textBox:', textBox, 'textElement:', textElement, 'fadeOverlay:', fadeOverlay);
    }
    
    // Debug matahari surga specifically
    if (matahariSurga) {
        console.log('Matahari surga found and loaded');
        console.log('Matahari surga initial transform:', matahariSurga.style.transform);
    } else {
        console.log('Matahari surga NOT FOUND!');
    }
});

// Reset to top on page refresh
window.onbeforeunload = function() {
    window.scrollTo(0, 0);
};

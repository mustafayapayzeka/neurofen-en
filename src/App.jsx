import { useState, useEffect, useRef } from "react";

// ── Nöromit Veritabanı ────────────────────────────────────────────────────────
const BASLANGIC_MITLER = [
  { id:1, baslik:"The 10% Brain Myth", kategori:"Brain Usage", emoji:"🧠", mit:"Humans only use 10% of their brain, with the remaining 90% lying dormant.", bilim:"Brain imaging studies show that the entire brain is used during daily activities. No brain region is permanently inactive.", fenBaglantisi:"In science classes, communicate to students that every student can learn at full capacity.", alternatif:"Offer varied learning activities that activate different brain regions: experiments, discussions, visual analysis.", kaynaklar:["Beyerstein, B.L. (1999). Whence cometh the myth that we only use 10% of our brains?"], anahtar_kelimeler:["10% brain","ten percent","unused brain","brain capacity"] },
  { id:2, baslik:"Learning Styles (VAK)", kategori:"Learning", emoji:"👁️", mit:"Each student has a specific learning style — visual, auditory, or kinesthetic — and learns better when taught according to that style.", bilim:"Pashler et al. (2008) found no reliable evidence that matching teaching to learning styles improves outcomes.", fenBaglantisi:"In science classes, avoid labelling students as 'visual learners' or 'kinesthetic learners'.", alternatif:"Offer multiple representations to all students: experiments + graphs + explanations. Apply Universal Design for Learning principles.", kaynaklar:["Pashler et al. (2008). Learning Styles: Concepts and Evidence."], anahtar_kelimeler:["visual learner","auditory learner","kinesthetic","learning style","VAK"] },
  { id:3, baslik:"Left Brain / Right Brain", kategori:"Brain Lateralisation", emoji:"🔀", mit:"People think predominantly with either the left brain (logical) or the right brain (creative).", bilim:"fMRI studies show that both hemispheres work together for most tasks. The 'left-brained/right-brained personality' is not scientifically valid.", fenBaglantisi:"In science teaching, avoid labels such as 'this activity is for right-brain students'.", alternatif:"Combine creative and analytical thinking in science lessons.", kaynaklar:["Nielsen et al. (2013). PLOS ONE - An Evaluation of the Left-Brain vs. Right-Brain Hypothesis"], anahtar_kelimeler:["left brain","right brain","left-brained","right-brained"] },
  { id:4, baslik:"Multiple Intelligences Theory", kategori:"Multiple Intelligences", emoji:"🎯", mit:"Each student has a specific intelligence type (musical, bodily, mathematical) and instruction should be designed according to that type.", bilim:"Gardner's theory is a theoretical framework; empirical evidence that teaching by intelligence type improves achievement is insufficient.", fenBaglantisi:"In science classes, offering activities based on only one intelligence type does not serve all students.", alternatif:"Create rich learning environments: combine visual, auditory, and movement-based activities for all students.", kaynaklar:["Waterhouse (2006). Multiple Intelligences, the Mozart Effect... Educational Psychologist."], anahtar_kelimeler:["multiple intelligences","musical intelligence","bodily intelligence","Gardner","intelligence type"] },
  { id:5, baslik:"Brain Gym", kategori:"Learning Activation", emoji:"🤸", mit:"Specific physical movements strengthen neural connections and directly enhance learning.", bilim:"There is no independent, peer-reviewed research supporting the effectiveness of Brain Gym.", fenBaglantisi:"Short breaks in science classes are beneficial — not because of neural connections, but because they refresh attention.", alternatif:"Give short physical breaks between lessons, explaining them as 'attention renewal' rather than 'brain activation'.", kaynaklar:["Hyatt (2007). Brain Gym: Building Stronger Brains or Wishful Thinking?"], anahtar_kelimeler:["brain gym","brain activation","neural exercise","cross-lateral movements"] },
  { id:6, baslik:"Critical Period Myth", kategori:"Brain Development", emoji:"⏰", mit:"There are critical periods for brain development; if missed, learning becomes permanently more difficult.", bilim:"The brain retains plasticity throughout life. The brain never closes to learning.", fenBaglantisi:"Avoid thinking that 'this should have been learned in primary school, it's too difficult now'.", alternatif:"Scientific thinking skills can be developed at any age. Focus on student readiness, not age.", kaynaklar:["Blakemore & Frith (2005). The Learning Brain: Lessons for Education."], anahtar_kelimeler:["critical period","sensitive period","early learning","brain closes"] }
];

// ── Güncel Araştırmalar Veritabanı ───────────────────────────────────────────
const BASLANGIC_ARASTIRMALAR = [
  { id:1, baslik:"Prevalence of Neuromyths among Science Teachers", ozet:"A study of 340 middle school science teachers found that 76% believed in the learning styles myth and 61% considered the left/right brain theory valid.", kaynak:"Dündar & Çakıroğlu (2024). Journal of Science Education, 12(1), 45-67.", yil:"2024", etiket:"Turkey", renk:"#4fc3f7" },
  { id:2, baslik:"Effect of Neuromyth Training on Teacher Beliefs", ozet:"A 43% reduction in neuromyth beliefs was observed among science teachers who completed an 8-week awareness training. Mobile-based interventions were found to be as effective as face-to-face training.", kaynak:"Howard-Jones et al. (2024). Mind, Brain & Education, 18(2), 112-128.", yil:"2024", etiket:"Meta-Analysis", renk:"#9c64f0" },
  { id:3, baslik:"Multiple Intelligences and Science Achievement", ozet:"A randomised controlled study showed that science activities designed according to Gardner's multiple intelligences theory provided no significant academic advantage over the control group.", kaynak:"Rogowsky & Calhoun (2023). Science Education, 107(4), 890-912.", yil:"2023", etiket:"RCT", renk:"#66bb6a" }
];

// ── Sabitler ──────────────────────────────────────────────────────────────────
const EMOJILER = ["🧠","👁️","🔀","🎯","🤸","⏰","💡","🔬","📚","🎓","⚡","🌱","🔑","💭","🧩","🎨","📖","🔍","🧬","🔭"];
const ARASTIRMA_RENKLERI = ["#4fc3f7","#9c64f0","#66bb6a","#f06292","#ffb74d","#80cbc4"];
const BOŞ_FORM = { baslik:"", kategori:"", yeniKategori:"", emoji:"🧠", mit:"", bilim:"", fenBaglantisi:"", alternatif:"", kaynaklar:"", anahtar_kelimeler:"" };
const BOŞ_ARASTIRMA = { baslik:"", ozet:"", kaynak:"", yil:"", etiket:"", renk:"#4fc3f7" };

// ── Yardımcı ──────────────────────────────────────────────────────────────────
function tespit_et(metin, mitler) {
  const metinKucuk = metin.toLowerCase();
  return mitler.filter(mit => mit.anahtar_kelimeler.some(k => metinKucuk.includes(k.toLowerCase())))
    .map(mit => ({ ...mit, eslesen_kelimeler: mit.anahtar_kelimeler.filter(k => metinKucuk.includes(k.toLowerCase())) }));
}

function Alan({ label, zorunlu, hata, children }) {
  return (
    <div style={{ marginBottom: 14 }}>
      <label style={{ fontSize: 11, color: hata ? "#f06292" : "#7986a3", fontFamily: "monospace", letterSpacing: "0.5px", display: "block", marginBottom: 5 }}>
        {label} {zorunlu && <span style={{ color: "#f06292" }}>*</span>}
      </label>
      {children}
      {hata && <div style={{ fontSize: 11, color: "#f06292", marginTop: 4 }}>⚠ {hata}</div>}
    </div>
  );
}

const inputStil = (hata) => ({
  width: "100%", background: "rgba(255,255,255,0.05)", border: `1px solid ${hata ? "rgba(240,98,146,0.5)" : "rgba(255,255,255,0.1)"}`,
  borderRadius: 10, padding: "10px 12px", color: "#e8eaf0", fontSize: 13, fontFamily: "inherit",
  outline: "none", boxSizing: "border-box", lineHeight: 1.6
});

// ── Ana Uygulama ──────────────────────────────────────────────────────────────
export default function App() {
  // Nöromit state
  const [mitler, setMitler] = useState(BASLANGIC_MITLER);
  const [aktifEkran, setAktifEkran] = useState("ana");
  const [secilenMit, setSecilenMit] = useState(null);
  const [oncekiEkran, setOncekiEkran] = useState("kutuphane");
  const [kategori, setKategori] = useState("All");
  const [analiz, setAnaliz] = useState({ metin: "", sonuclar: [], yapildi: false, aiSonuc: null });
  const [chatMesajlar, setChatMesajlar] = useState([
    { rol: "ai", icerik: "Hello! I'm the NöroFen assistant 🧠 I can help you detect neuromyths in your lesson plans!" }
  ]);
  const [chatGirdi, setChatGirdi] = useState("");
  const [chatYukleniyor, setChatYukleniyor] = useState(false);
  const [analizYukleniyor, setAnalizYukleniyor] = useState(false);
  const [rozetler, setRozetler] = useState([]);
  const [form, setForm] = useState(BOŞ_FORM);
  const [duzenlemId, setDuzenlemId] = useState(null);
  const [formHata, setFormHata] = useState({});
  const [silOnay, setSilOnay] = useState(null);
  const [basariMesaj, setBasariMesaj] = useState("");
  const [emojiSecici, setEmojiSecici] = useState(false);
  const [akkordeon, setAkkordeon] = useState(null);
  // Araştırma state
  const [arastirmalar, setArastirmalar] = useState(BASLANGIC_ARASTIRMALAR);
  const [arastirmaForm, setArastirmaForm] = useState(BOŞ_ARASTIRMA);
  const [arastirmaFormHata, setArastirmaFormHata] = useState({});
  const [arastirmaDuzenlemId, setArastirmaDuzenlemId] = useState(null);
  const [arastirmaDetay, setArastirmaDetay] = useState(null);
  const [arasSilOnay, setArasSilOnay] = useState(null);
  const chatSonRef = useRef(null);

  useEffect(() => {
    if (chatSonRef.current) chatSonRef.current.scrollIntoView({ behavior: "smooth" });
  }, [chatMesajlar]);

  useEffect(() => {
    if (basariMesaj) { const t = setTimeout(() => setBasariMesaj(""), 3000); return () => clearTimeout(t); }
  }, [basariMesaj]);

  const kategoriler = ["All", ...new Set(mitler.map(n => n.kategori))];
  const filtreliMitler = kategori === "All" ? mitler : mitler.filter(m => m.kategori === kategori);
  const mevcutKategoriler = [...new Set(mitler.map(n => n.kategori))];

  // ── Nöromit işlevleri ────────────────────────────────────────────────────
  function detayGit(mit, kaynak = "kutuphane") { setSecilenMit(mit); setOncekiEkran(kaynak); setAktifEkran("detay"); }
  function formGuncelle(alan, deger) { setForm(p => ({ ...p, [alan]: deger })); if (formHata[alan]) setFormHata(p => ({ ...p, [alan]: "" })); }

  function formDogrula() {
    const h = {};
    if (!form.baslik.trim()) h.baslik = "Title is required";
    if (!form.kategori && !form.yeniKategori.trim()) h.kategori = "Select a category or enter a new one";
    if (!form.mit.trim()) h.mit = "Myth description is required";
    if (!form.bilim.trim()) h.bilim = "Scientific explanation is required";
    if (!form.alternatif.trim()) h.alternatif = "Alternative strategy is required";
    if (!form.anahtar_kelimeler.trim()) h.anahtar_kelimeler = "Enter at least one keyword";
    setFormHata(h); return Object.keys(h).length === 0;
  }

  function mitKaydet() {
    if (!formDogrula()) return;
    const kat = form.yeniKategori.trim() || form.kategori;
    const yeni = { id: duzenlemId || Date.now(), baslik:form.baslik.trim(), kategori:kat, emoji:form.emoji, mit:form.mit.trim(), bilim:form.bilim.trim(), fenBaglantisi:form.fenBaglantisi.trim(), alternatif:form.alternatif.trim(), kaynaklar:form.kaynaklar.split("\n").map(k=>k.trim()).filter(Boolean), anahtar_kelimeler:form.anahtar_kelimeler.split(",").map(k=>k.trim()).filter(Boolean) };
    if (duzenlemId) { setMitler(p => p.map(m => m.id === duzenlemId ? yeni : m)); setBasariMesaj("✅ Neuromyth updated!"); }
    else { setMitler(p => [...p, yeni]); setBasariMesaj("✅ New neuromyth added!"); }
    setForm(BOŞ_FORM); setDuzenlemId(null); setFormHata({}); setAktifEkran("kutuphane");
  }

  function duzenlemeBaslat(mit) {
    setForm({ baslik:mit.baslik, kategori:mit.kategori, yeniKategori:"", emoji:mit.emoji, mit:mit.mit, bilim:mit.bilim, fenBaglantisi:mit.fenBaglantisi||"", alternatif:mit.alternatif, kaynaklar:mit.kaynaklar.join("\n"), anahtar_kelimeler:mit.anahtar_kelimeler.join(", ") });
    setDuzenlemId(mit.id); setFormHata({}); setAktifEkran("mitEkle");
  }

  function mitSil(id) { setMitler(p => p.filter(m => m.id !== id)); setSilOnay(null); setBasariMesaj("🗑️ Neuromyth deleted."); setAktifEkran("kutuphane"); }

  // ── Araştırma işlevleri ──────────────────────────────────────────────────
  function arastirmaFormGuncelle(alan, deger) { setArastirmaForm(p => ({ ...p, [alan]: deger })); if (arastirmaFormHata[alan]) setArastirmaFormHata(p => ({ ...p, [alan]: "" })); }

  function arastirmaDogrula() {
    const h = {};
    if (!arastirmaForm.baslik.trim()) h.baslik = "Title is required";
    if (!arastirmaForm.ozet.trim()) h.ozet = "Summary is required";
    if (!arastirmaForm.kaynak.trim()) h.kaynak = "Source is required";
    if (!arastirmaForm.yil.trim()) h.yil = "Year is required";
    setArastirmaFormHata(h); return Object.keys(h).length === 0;
  }

  function arastirmaKaydet() {
    if (!arastirmaDogrula()) return;
    const yeni = { id: arastirmaDuzenlemId || Date.now(), baslik:arastirmaForm.baslik.trim(), ozet:arastirmaForm.ozet.trim(), kaynak:arastirmaForm.kaynak.trim(), yil:arastirmaForm.yil.trim(), etiket:arastirmaForm.etiket.trim()||"Araştırma", renk:arastirmaForm.renk };
    if (arastirmaDuzenlemId) { setArastirmalar(p => p.map(a => a.id === arastirmaDuzenlemId ? yeni : a)); setBasariMesaj("✅ Research updated!"); }
    else { setArastirmalar(p => [yeni, ...p]); setBasariMesaj("✅ New research added!"); }
    setArastirmaForm(BOŞ_ARASTIRMA); setArastirmaDuzenlemId(null); setArastirmaFormHata({}); setAktifEkran("yonetici");
  }

  function arastirmaDuzenlemeBaslat(a) {
    setArastirmaForm({ baslik:a.baslik, ozet:a.ozet, kaynak:a.kaynak, yil:a.yil, etiket:a.etiket, renk:a.renk });
    setArastirmaDuzenlemId(a.id); setArastirmaFormHata({}); setAktifEkran("arastirmaEkle");
  }

  function arastirmaSil(id) { setArastirmalar(p => p.filter(a => a.id !== id)); setArasSilOnay(null); setArastirmaDetay(null); setBasariMesaj("🗑️ Research deleted."); }

  // ── Analiz ──────────────────────────────────────────────────────────────
  async function analizEt() {
    if (!analiz.metin.trim()) return;
    setAnalizYukleniyor(true);
    const yerel = tespit_et(analiz.metin, mitler);
    await new Promise(r => setTimeout(r, 600));
    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method:"POST", headers:{"Content-Type":"application/json"},
        body: JSON.stringify({ model:"claude-sonnet-4-20250514", max_tokens:1000,
          system:`You are an expert assistant in detecting neuromyths in science education. Reply in English. Return only JSON: {"ozet":"brief evaluation","temiz":true/false}`,
          messages:[{role:"user",content:`Evaluate this lesson plan for neuromyths:\n\n${analiz.metin}`}] })
      });
      const veri = await res.json();
      const txt = veri.content?.map(b=>b.text||"").join("") || "";
      let aiSonuc = null;
      try { aiSonuc = JSON.parse(txt.replace(/```json|```/g,"").trim()); } catch(_) {}
      setAnaliz(p => ({ ...p, sonuclar:yerel, aiSonuc, yapildi:true }));
      if (yerel.length === 0) setRozetler(p => p.includes("temiz") ? p : [...p,"temiz"]);
    } catch(_) { setAnaliz(p => ({ ...p, sonuclar:yerel, yapildi:true })); }
    setAnalizYukleniyor(false);
  }

  async function chatGonder() {
    if (!chatGirdi.trim() || chatYukleniyor) return;
    const mesaj = chatGirdi; setChatGirdi("");
    setChatMesajlar(p => [...p,{rol:"kullanici",icerik:mesaj}]);
    setChatYukleniyor(true);
    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method:"POST", headers:{"Content-Type":"application/json"},
        body: JSON.stringify({ model:"claude-sonnet-4-20250514", max_tokens:1000,
          system:`You are the English-speaking AI assistant of the NöroFen app. You help science teachers with neuromyths. Give short, scientific answers.`,
          messages:[{role:"user",content:mesaj}] })
      });
      const veri = await res.json();
      const yanit = veri.content?.map(b=>b.text||"").join("") || "Sorry, an error occurred.";
      setChatMesajlar(p => [...p,{rol:"ai",icerik:yanit}]);
    } catch(_) { setChatMesajlar(p => [...p,{rol:"ai",icerik:"Connection error. Please try again."}]); }
    setChatYukleniyor(false);
  }

  // ── RENDER ────────────────────────────────────────────────────────────────
  const S = { // ortak stiller
    kart: { background:"rgba(255,255,255,0.02)", border:"1px solid rgba(255,255,255,0.06)", borderRadius:13, padding:14, marginBottom:9 },
    btn: (renk) => ({ background:`rgba(${renk},0.12)`, border:`1px solid rgba(${renk},0.25)`, borderRadius:8, padding:"6px 12px", fontSize:12, cursor:"pointer" }),
  };

  return (
    <div style={{ fontFamily:"'Georgia',serif", background:"#0a0e1a", minHeight:"100vh", color:"#e8eaf0", maxWidth:430, margin:"0 auto", position:"relative" }}>
      <div style={{ position:"fixed", inset:0, background:"radial-gradient(ellipse at 20% 20%,rgba(99,179,237,0.07) 0%,transparent 50%),radial-gradient(ellipse at 80% 80%,rgba(154,117,241,0.07) 0%,transparent 50%)", pointerEvents:"none", zIndex:0 }} />

      {/* Toast */}
      {basariMesaj && (
        <div style={{ position:"fixed", top:20, left:"50%", transform:"translateX(-50%)", background:"rgba(30,40,60,0.98)", border:"1px solid rgba(79,195,247,0.4)", borderRadius:12, padding:"10px 20px", fontSize:13, color:"#4fc3f7", zIndex:9999, whiteSpace:"nowrap", boxShadow:"0 8px 32px rgba(0,0,0,0.4)" }}>
          {basariMesaj}
        </div>
      )}

      {/* Silme Modal - Nöromit */}
      {silOnay && (
        <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.7)", zIndex:9000, display:"flex", alignItems:"center", justifyContent:"center", padding:20 }}>
          <div style={{ background:"#141826", border:"1px solid rgba(240,98,146,0.3)", borderRadius:16, padding:24, maxWidth:300, width:"100%" }}>
            <div style={{ fontSize:26, textAlign:"center", marginBottom:10 }}>🗑️</div>
            <div style={{ fontSize:14, fontWeight:600, color:"#fff", textAlign:"center", marginBottom:6 }}>Nöromiti Sil</div>
            <div style={{ fontSize:12, color:"#9aa5be", textAlign:"center", marginBottom:18 }}><strong style={{color:"#f06292"}}>{mitler.find(m=>m.id===silOnay)?.baslik}</strong> will be deleted.</div>
            <div style={{ display:"flex", gap:10 }}>
              <button onClick={()=>setSilOnay(null)} style={{ flex:1, background:"rgba(255,255,255,0.06)", border:"1px solid rgba(255,255,255,0.1)", borderRadius:10, padding:"9px", color:"#9aa5be", fontSize:13, cursor:"pointer" }}>İptal</button>
              <button onClick={()=>mitSil(silOnay)} style={{ flex:1, background:"rgba(240,98,146,0.18)", border:"1px solid rgba(240,98,146,0.35)", borderRadius:10, padding:"9px", color:"#f06292", fontSize:13, cursor:"pointer", fontWeight:600 }}>Evet, Sil</button>
            </div>
          </div>
        </div>
      )}

      {/* Silme Modal - Araştırma */}
      {arasSilOnay && (
        <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.7)", zIndex:9000, display:"flex", alignItems:"center", justifyContent:"center", padding:20 }}>
          <div style={{ background:"#141826", border:"1px solid rgba(240,98,146,0.3)", borderRadius:16, padding:24, maxWidth:300, width:"100%" }}>
            <div style={{ fontSize:26, textAlign:"center", marginBottom:10 }}>🗑️</div>
            <div style={{ fontSize:14, fontWeight:600, color:"#fff", textAlign:"center", marginBottom:6 }}>Araştırmayı Sil</div>
            <div style={{ fontSize:12, color:"#9aa5be", textAlign:"center", marginBottom:18 }}><strong style={{color:"#f06292"}}>{arastirmalar.find(a=>a.id===arasSilOnay)?.baslik}</strong> will be deleted.</div>
            <div style={{ display:"flex", gap:10 }}>
              <button onClick={()=>setArasSilOnay(null)} style={{ flex:1, background:"rgba(255,255,255,0.06)", border:"1px solid rgba(255,255,255,0.1)", borderRadius:10, padding:"9px", color:"#9aa5be", fontSize:13, cursor:"pointer" }}>İptal</button>
              <button onClick={()=>arastirmaSil(arasSilOnay)} style={{ flex:1, background:"rgba(240,98,146,0.18)", border:"1px solid rgba(240,98,146,0.35)", borderRadius:10, padding:"9px", color:"#f06292", fontSize:13, cursor:"pointer", fontWeight:600 }}>Evet, Sil</button>
            </div>
          </div>
        </div>
      )}

      <div style={{ position:"relative", zIndex:1, paddingBottom:80 }}>

        {/* HEADER */}
        <div style={{ padding:"18px 20px 14px", borderBottom:"1px solid rgba(255,255,255,0.06)" }}>
          <div style={{ display:"flex", alignItems:"center", gap:10 }}>
            <img src="/logo.png" alt="NöroFen Logo" style={{ width:42, height:42, borderRadius:10, objectFit:"cover" }}/>
            <div>
              <div style={{ fontSize:19, fontWeight:700, color:"#fff", letterSpacing:"-0.5px" }}>NöroFen</div>
              <div style={{ fontSize:10, color:"#7986a3", fontFamily:"monospace" }}>Nöromitten Arın · Bilimle Öğret</div>
            </div>
            <div style={{ marginLeft:"auto", fontSize:11, color:"#7986a3", fontFamily:"monospace" }}>{mitler.length} mit</div>
          </div>
        </div>

        {/* ── ANA SAYFA ──────────────────────────────────────────────── */}
        {aktifEkran === "ana" && (
          <div style={{ padding:"18px 16px" }}>
            {/* Günün mitosu */}
            <div style={{ background:"linear-gradient(135deg,rgba(79,195,247,0.1),rgba(156,100,240,0.1))", border:"1px solid rgba(79,195,247,0.18)", borderRadius:16, padding:18, marginBottom:16 }}>
              <div style={{ fontSize:10, color:"#4fc3f7", fontFamily:"monospace", letterSpacing:"1px", marginBottom:6 }}>✦ GÜNÜN NÖROMİTİ</div>
              <div style={{ fontSize:15, fontWeight:600, color:"#fff", marginBottom:6 }}>{mitler[0]?.emoji} {mitler[0]?.baslik}</div>
              <div style={{ fontSize:12, color:"#9aa5be", lineHeight:1.6 }}>{mitler[0]?.mit.substring(0,100)}...</div>
              <button onClick={()=>detayGit(mitler[0],"ana")} style={{ marginTop:10, background:"rgba(79,195,247,0.12)", border:"1px solid rgba(79,195,247,0.25)", color:"#4fc3f7", borderRadius:8, padding:"6px 14px", fontSize:11, cursor:"pointer", fontFamily:"monospace" }}>Detayları Gör →</button>
            </div>

            {/* Son araştırma önizleme */}
            {arastirmalar.length > 0 && (
              <div onClick={()=>setAktifEkran("arastirmalar")} style={{ background:`linear-gradient(135deg,${arastirmalar[0].renk}18,rgba(255,255,255,0.02))`, border:`1px solid ${arastirmalar[0].renk}30`, borderRadius:14, padding:14, marginBottom:16, cursor:"pointer" }}>
                <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:6 }}>
                  <span style={{ fontSize:10, color:arastirmalar[0].renk, fontFamily:"monospace", letterSpacing:"1px" }}>🔬 GÜNCEL ARAŞTIRMA</span>
                  <span style={{ marginLeft:"auto", background:`${arastirmalar[0].renk}22`, color:arastirmalar[0].renk, borderRadius:6, padding:"2px 8px", fontSize:10, fontFamily:"monospace" }}>{arastirmalar[0].yil}</span>
                </div>
                <div style={{ fontSize:13, fontWeight:600, color:"#fff", marginBottom:4 }}>{arastirmalar[0].baslik}</div>
                <div style={{ fontSize:12, color:"#9aa5be", lineHeight:1.5 }}>{arastirmalar[0].ozet.substring(0,90)}...</div>
                <div style={{ fontSize:11, color:arastirmalar[0].renk, marginTop:8, fontFamily:"monospace" }}>Tüm araştırmaları gör ({arastirmalar.length}) →</div>
              </div>
            )}

            {/* Hızlı erişim */}
            <div style={{ fontSize:10, color:"#7986a3", fontFamily:"monospace", letterSpacing:"1px", marginBottom:10 }}>HIZLI ERİŞİM</div>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10, marginBottom:16 }}>
              {[
                {ikon:"🔍",baslik:"Text Analysis",alt:"Scan lesson plan",ekran:"analiz"},
                {ikon:"📚",baslik:"Library",alt:`${mitler.length} neuromyths`,ekran:"kutuphane"},
                {ikon:"🔬",baslik:"Research",alt:`${arastirmalar.length} recent studies`,ekran:"arastirmalar"},
                {ikon:"💬",baslik:"AI Assistant",alt:"Ask a question",ekran:"chat"},
              ].map(k => (
                <button key={k.ekran} onClick={()=>setAktifEkran(k.ekran)}
                  style={{ background:"rgba(255,255,255,0.03)", border:"1px solid rgba(255,255,255,0.07)", borderRadius:13, padding:"13px 11px", textAlign:"left", cursor:"pointer" }}>
                  <div style={{ fontSize:22, marginBottom:5 }}>{k.ikon}</div>
                  <div style={{ fontSize:13, fontWeight:600, color:"#fff", marginBottom:2 }}>{k.baslik}</div>
                  <div style={{ fontSize:11, color:"#7986a3" }}>{k.alt}</div>
                </button>
              ))}
            </div>

            {/* ── HAKKINDA ACCORDION ── */}
            <div style={{ marginBottom:16 }}>
              <button onClick={()=>setAkkordeon(akkordeon?"":"acik")}
                style={{ width:"100%", background:"rgba(255,255,255,0.02)", border:"1px solid rgba(255,255,255,0.07)", borderRadius:13, padding:"13px 16px", display:"flex", alignItems:"center", cursor:"pointer" }}>
                <span style={{ fontSize:16, marginRight:8 }}>ℹ️</span>
                <span style={{ fontSize:13, fontWeight:600, color:"#fff", flex:1, textAlign:"left" }}>Uygulama Hakkında</span>
                <span style={{ color:"#7986a3", fontSize:14, transition:"transform 0.3s", transform:akkordeon?"rotate(180deg)":"rotate(0deg)" }}>▾</span>
              </button>

              {akkordeon && (
                <div style={{ marginTop:8, display:"flex", flexDirection:"column", gap:8 }}>

                  {/* Vizyon */}
                  {[
                    { id:"vizyon", ikon:"🧠", baslik:"Amaç & Vizyon", renk:"#4fc3f7",
                      icerik: <div style={{ fontSize:12, color:"#9aa5be", lineHeight:1.7, borderLeft:"2px solid rgba(79,195,247,0.3)", paddingLeft:10 }}>NöroFen is an AI-powered guide application developed to detect neuroscientific myths that science teachers unknowingly use in their lesson plans and to offer evidence-based alternatives.<br/><br/><span style={{color:"#4fc3f7",fontFamily:"monospace",fontSize:10}}>v1.0.0 · Mart 2026</span></div>
                    },
                    { id:"gelistirici", ikon:"👤", baslik:"Geliştirici / Akademisyen", renk:"#9c64f0",
                      icerik: <div style={{ display:"flex", alignItems:"center", gap:12 }}>
                        <div style={{ width:44, height:44, borderRadius:"50%", background:"linear-gradient(135deg,#9c64f0,#f06292)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:20, flexShrink:0 }}>🎓</div>
                        <div>
                          <div style={{ fontSize:13, fontWeight:600, color:"#fff" }}>Mustafa Yapayzeka</div>
                          <div style={{ fontSize:11, color:"#9aa5be", marginTop:2 }}>Fen Bilimleri Eğitimi Araştırmacısı</div>
                          <div style={{ fontSize:11, color:"#7986a3", marginTop:2, fontFamily:"monospace" }}>Nöroeğitim · Öğretmen Eğitimi</div>
                        </div>
                      </div>
                    },
                    { id:"kilavuz", ikon:"📖", baslik:"Nasıl Kullanılır?", renk:"#66bb6a",
                      icerik: <div>{[
                        {no:"1",ikon:"🔍",baslik:"Text Analysis",aciklama:"Paste your lesson plan, let the AI detect neuromyths."},
                        {no:"2",ikon:"📚",baslik:"Library",aciklama:"Browse neuromyths, learn evidence-based alternatives."},
                        {no:"3",ikon:"🔬",baslik:"Research",aciklama:"Follow the latest study findings."},
                        {no:"4",ikon:"💬",baslik:"AI Assistant",aciklama:"Ask the AI any questions you have."},
                      ].map(a => (
                        <div key={a.no} style={{ display:"flex", gap:10, marginBottom:8, alignItems:"flex-start" }}>
                          <div style={{ width:20, height:20, borderRadius:"50%", background:"rgba(102,187,106,0.15)", border:"1px solid rgba(102,187,106,0.3)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:10, color:"#66bb6a", fontFamily:"monospace", flexShrink:0, marginTop:1 }}>{a.no}</div>
                          <div>
                            <div style={{ fontSize:12, fontWeight:600, color:"#fff" }}>{a.ikon} {a.baslik}</div>
                            <div style={{ fontSize:11, color:"#9aa5be", lineHeight:1.5, marginTop:1 }}>{a.aciklama}</div>
                          </div>
                        </div>
                      ))}</div>
                    },
                    { id:"versiyon", ikon:"🕐", baslik:"Versiyon Geçmişi", renk:"#ffb74d",
                      icerik: <div style={{ display:"flex", gap:10, alignItems:"flex-start" }}>
                        <span style={{ background:"rgba(255,183,77,0.15)", color:"#ffb74d", borderRadius:6, padding:"2px 8px", fontSize:10, fontFamily:"monospace", flexShrink:0 }}>v1.0.0</span>
                        <div>
                          <div style={{ fontSize:11, color:"#7986a3", fontFamily:"monospace" }}>Mart 2026</div>
                          <div style={{ fontSize:12, color:"#c5cee0", marginTop:2 }}>İlk yayın — 6 nöromit, AI analiz, araştırma modülü</div>
                        </div>
                      </div>
                    },
                    { id:"iletisim", ikon:"✉️", baslik:"İletişim & Geri Bildirim", renk:"#f06292",
                      icerik: <div>
                        <div style={{ fontSize:12, color:"#9aa5be", lineHeight:1.6, marginBottom:10 }}>Öneri, hata bildirimi veya iş birliği için iletişime geçebilirsiniz.</div>
                        {[{ikon:"📧",etiket:"E-posta",deger:"iletisim@neurofen.app"},{ikon:"🌐",etiket:"Web",deger:"neurofen.vercel.app"}].map(k=>(
                          <div key={k.etiket} style={{ display:"flex", alignItems:"center", gap:8, marginBottom:5 }}>
                            <span style={{ fontSize:13 }}>{k.ikon}</span>
                            <span style={{ fontSize:11, color:"#7986a3", width:52 }}>{k.etiket}:</span>
                            <span style={{ fontSize:12, color:"#4fc3f7", fontFamily:"monospace" }}>{k.deger}</span>
                          </div>
                        ))}
                      </div>
                    },
                  ].map(b => (
                    <div key={b.id} style={{ background:"rgba(255,255,255,0.02)", border:`1px solid ${b.renk}22`, borderLeft:`3px solid ${b.renk}55`, borderRadius:12, overflow:"hidden" }}>
                      <button onClick={()=>setAkkordeon(akkordeon===b.id?null:b.id)}
                        style={{ width:"100%", background:"none", border:"none", padding:"11px 14px", display:"flex", alignItems:"center", gap:8, cursor:"pointer" }}>
                        <span style={{ fontSize:14 }}>{b.ikon}</span>
                        <span style={{ fontSize:12, fontWeight:600, color:"#fff", flex:1, textAlign:"left" }}>{b.baslik}</span>
                        <span style={{ color:b.renk, fontSize:12, transition:"transform 0.2s", transform:akkordeon===b.id?"rotate(180deg)":"rotate(0deg)" }}>▾</span>
                      </button>
                      {akkordeon === b.id && (
                        <div style={{ padding:"0 14px 13px" }}>{b.icerik}</div>
                      )}
                    </div>
                  ))}

                  <div style={{ textAlign:"center", padding:"8px 0 4px" }}>
                    <div style={{ fontSize:10, color:"#4a5568", fontFamily:"monospace" }}>© 2026 NöroFen · Tüm hakları saklıdır</div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── GÜNCEL ARAŞTIRMALAR (kullanıcı görünümü) ───────────────── */}
        {aktifEkran === "arastirmalar" && (
          <div style={{ padding:"18px 16px" }}>
            <div style={{ fontSize:17, fontWeight:700, color:"#fff", marginBottom:4 }}>🔬 Güncel Araştırmalar</div>
            <div style={{ fontSize:12, color:"#7986a3", marginBottom:18 }}>Nöroeğitim alanındaki son çalışmalar</div>

            {arastirmalar.length === 0 ? (
              <div style={{ textAlign:"center", padding:"40px 20px", color:"#7986a3" }}>
                <div style={{ fontSize:32, marginBottom:12 }}>🔬</div>
                <div style={{ fontSize:14 }}>Henüz araştırma eklenmemiş.</div>
              </div>
            ) : (
              arastirmalar.map(a => (
                <button key={a.id} onClick={()=>setArastirmaDetay(a)}
                  style={{ width:"100%", ...S.kart, textAlign:"left", cursor:"pointer", borderLeft:`3px solid ${a.renk}`, display:"block" }}>
                  <div style={{ display:"flex", alignItems:"flex-start", gap:10, marginBottom:8 }}>
                    <div style={{ flex:1 }}>
                      <div style={{ fontSize:13, fontWeight:600, color:"#fff", marginBottom:4, lineHeight:1.4 }}>{a.baslik}</div>
                      <div style={{ display:"flex", gap:6 }}>
                        <span style={{ background:`${a.renk}20`, color:a.renk, borderRadius:6, padding:"2px 8px", fontSize:10, fontFamily:"monospace" }}>{a.yil}</span>
                        {a.etiket && <span style={{ background:"rgba(255,255,255,0.06)", color:"#9aa5be", borderRadius:6, padding:"2px 8px", fontSize:10, fontFamily:"monospace" }}>{a.etiket}</span>}
                      </div>
                    </div>
                    <span style={{ color:a.renk, fontSize:16, marginTop:2 }}>›</span>
                  </div>
                  <div style={{ fontSize:12, color:"#9aa5be", lineHeight:1.6 }}>{a.ozet.substring(0,110)}{a.ozet.length>110?"...":""}</div>
                </button>
              ))
            )}

            {/* Araştırma detay popup */}
            {arastirmaDetay && (
              <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.75)", zIndex:8000, display:"flex", alignItems:"flex-end", justifyContent:"center" }} onClick={()=>setArastirmaDetay(null)}>
                <div style={{ background:"#141826", border:`1px solid ${arastirmaDetay.renk}40`, borderRadius:"20px 20px 0 0", padding:24, width:"100%", maxWidth:430, maxHeight:"80vh", overflowY:"auto" }} onClick={e=>e.stopPropagation()}>
                  <div style={{ width:40, height:4, background:"rgba(255,255,255,0.15)", borderRadius:2, margin:"0 auto 20px" }} />
                  <div style={{ display:"flex", gap:8, marginBottom:12 }}>
                    <span style={{ background:`${arastirmaDetay.renk}22`, color:arastirmaDetay.renk, borderRadius:6, padding:"3px 10px", fontSize:11, fontFamily:"monospace" }}>{arastirmaDetay.yil}</span>
                    {arastirmaDetay.etiket && <span style={{ background:"rgba(255,255,255,0.06)", color:"#9aa5be", borderRadius:6, padding:"3px 10px", fontSize:11, fontFamily:"monospace" }}>{arastirmaDetay.etiket}</span>}
                  </div>
                  <div style={{ fontSize:16, fontWeight:700, color:"#fff", marginBottom:14, lineHeight:1.4 }}>{arastirmaDetay.baslik}</div>
                  <div style={{ background:`${arastirmaDetay.renk}12`, borderLeft:`3px solid ${arastirmaDetay.renk}`, borderRadius:10, padding:14, marginBottom:14 }}>
                    <div style={{ fontSize:10, color:arastirmaDetay.renk, fontFamily:"monospace", letterSpacing:"0.5px", marginBottom:6 }}>ARAŞTIRMA ÖZETİ</div>
                    <div style={{ fontSize:13, color:"#c5cee0", lineHeight:1.7 }}>{arastirmaDetay.ozet}</div>
                  </div>
                  <div style={{ background:"rgba(255,255,255,0.03)", border:"1px solid rgba(255,255,255,0.07)", borderRadius:10, padding:12 }}>
                    <div style={{ fontSize:10, color:"#7986a3", fontFamily:"monospace", marginBottom:6 }}>📖 KAYNAK</div>
                    <div style={{ fontSize:12, color:"#9aa5be", lineHeight:1.6, fontStyle:"italic" }}>{arastirmaDetay.kaynak}</div>
                  </div>
                  <button onClick={()=>setArastirmaDetay(null)} style={{ width:"100%", marginTop:16, background:"rgba(255,255,255,0.06)", border:"1px solid rgba(255,255,255,0.1)", borderRadius:10, padding:"11px", color:"#9aa5be", fontSize:13, cursor:"pointer" }}>Kapat</button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ── ANALİZ ─────────────────────────────────────────────────── */}
        {aktifEkran === "analiz" && (
          <div style={{ padding:"18px 16px" }}>
            <div style={{ fontSize:17, fontWeight:700, color:"#fff", marginBottom:4 }}>🔍 Metin Analizi</div>
            <div style={{ fontSize:12, color:"#7986a3", marginBottom:14 }}>Ders planınızı yapıştırın, AI nöromitleri tespit etsin</div>
            <textarea value={analiz.metin} onChange={e=>setAnaliz({metin:e.target.value,sonuclar:[],yapildi:false,aiSonuc:null})}
              placeholder="Write or paste your lesson plan here..."
              style={{...inputStil(false), minHeight:130, resize:"vertical"}} />
            <button onClick={analizEt} disabled={analizYukleniyor||!analiz.metin.trim()}
              style={{ width:"100%", marginTop:10, background:analizYukleniyor?"rgba(79,195,247,0.25)":"linear-gradient(135deg,#4fc3f7,#9c64f0)", border:"none", borderRadius:11, padding:"13px", color:"#fff", fontSize:13, fontWeight:600, cursor:analizYukleniyor?"not-allowed":"pointer" }}>
              {analizYukleniyor?"⏳ Analysing...":"✦ Analyse"}
            </button>
            {analiz.yapildi && (
              <div style={{ marginTop:18 }}>
                {analiz.sonuclar.length === 0 ? (
                  <div style={{ background:"rgba(102,187,106,0.08)", border:"1px solid rgba(102,187,106,0.25)", borderRadius:12, padding:16, textAlign:"center" }}>
                    <div style={{ fontSize:26, marginBottom:6 }}>✅</div>
                    <div style={{ color:"#66bb6a", fontWeight:600 }}>Nöromit tespit edilmedi!</div>
                    <div style={{ fontSize:12, color:"#7986a3", marginTop:4 }}>Ders planınız bilimsel görünüyor.</div>
                  </div>
                ) : (
                  <>
                    <div style={{ background:"rgba(240,98,146,0.08)", border:"1px solid rgba(240,98,146,0.25)", borderRadius:12, padding:13, marginBottom:10 }}>
                      <div style={{ color:"#f06292", fontWeight:600, fontSize:13, marginBottom:4 }}>⚠️ {analiz.sonuclar.length} nöromit tespit edildi</div>
                      {analiz.aiSonuc?.ozet && <div style={{ fontSize:12, color:"#9aa5be", lineHeight:1.6 }}>{analiz.aiSonuc.ozet}</div>}
                    </div>
                    {analiz.sonuclar.map(mit => (
                      <div key={mit.id} style={{ ...S.kart, borderLeft:"3px solid rgba(240,98,146,0.5)" }}>
                        <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:7 }}>
                          <span style={{ fontSize:18 }}>{mit.emoji}</span>
                          <span style={{ fontWeight:600, color:"#fff", fontSize:13 }}>{mit.baslik}</span>
                        </div>
                        <div style={{ fontSize:12, color:"#66bb6a", lineHeight:1.5, marginBottom:7 }}>✅ {mit.alternatif}</div>
                        <button onClick={()=>detayGit(mit,"analiz")} style={{ background:"rgba(79,195,247,0.08)", border:"1px solid rgba(79,195,247,0.18)", color:"#4fc3f7", borderRadius:7, padding:"5px 11px", fontSize:11, cursor:"pointer", fontFamily:"monospace" }}>Detaylı İncele →</button>
                      </div>
                    ))}
                  </>
                )}
              </div>
            )}
          </div>
        )}

        {/* ── KÜTÜPHANE ──────────────────────────────────────────────── */}
        {aktifEkran === "kutuphane" && (
          <div style={{ padding:"18px 16px" }}>
            <div style={{ display:"flex", alignItems:"center", marginBottom:4 }}>
              <div style={{ fontSize:17, fontWeight:700, color:"#fff" }}>📚 Nöromit Kütüphanesi</div>
              <button onClick={()=>{setForm(BOŞ_FORM);setDuzenlemId(null);setFormHata({});setAktifEkran("mitEkle");}}
                style={{ marginLeft:"auto", background:"rgba(79,195,247,0.12)", border:"1px solid rgba(79,195,247,0.25)", color:"#4fc3f7", borderRadius:8, padding:"6px 12px", fontSize:12, cursor:"pointer", fontWeight:600 }}>+ Yeni Mit</button>
            </div>
            <div style={{ fontSize:12, color:"#7986a3", marginBottom:12 }}>{mitler.length} nöromit · {new Set(mitler.map(m=>m.kategori)).size} kategori</div>
            <div style={{ display:"flex", gap:7, overflowX:"auto", paddingBottom:8, marginBottom:12 }}>
              {kategoriler.map(k => (
                <button key={k} onClick={()=>setKategori(k)} style={{ whiteSpace:"nowrap", padding:"5px 12px", borderRadius:18, border:"1px solid", borderColor:kategori===k?"#4fc3f7":"rgba(255,255,255,0.1)", background:kategori===k?"rgba(79,195,247,0.12)":"transparent", color:kategori===k?"#4fc3f7":"#7986a3", fontSize:11, cursor:"pointer" }}>{k}</button>
              ))}
            </div>
            {filtreliMitler.map(mit => (
              <div key={mit.id} style={{ ...S.kart, display:"flex", alignItems:"center", gap:10 }}>
                <button onClick={()=>detayGit(mit,"kutuphane")} style={{ flex:1, background:"none", border:"none", textAlign:"left", cursor:"pointer", padding:0, display:"flex", alignItems:"center", gap:10 }}>
                  <span style={{ fontSize:20 }}>{mit.emoji}</span>
                  <div>
                    <div style={{ fontWeight:600, color:"#fff", fontSize:13 }}>{mit.baslik}</div>
                    <div style={{ fontSize:10, color:"#7986a3", fontFamily:"monospace", marginTop:2 }}>{mit.kategori}</div>
                  </div>
                </button>
                <div style={{ display:"flex", gap:6, flexShrink:0 }}>
                  <button onClick={()=>duzenlemeBaslat(mit)} style={{ background:"rgba(79,195,247,0.1)", border:"1px solid rgba(79,195,247,0.2)", color:"#4fc3f7", borderRadius:7, padding:"5px 9px", fontSize:12, cursor:"pointer" }}>✏️</button>
                  <button onClick={()=>setSilOnay(mit.id)} style={{ background:"rgba(240,98,146,0.1)", border:"1px solid rgba(240,98,146,0.2)", color:"#f06292", borderRadius:7, padding:"5px 9px", fontSize:12, cursor:"pointer" }}>🗑️</button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ── DETAY ──────────────────────────────────────────────────── */}
        {aktifEkran === "detay" && secilenMit && (
          <div style={{ padding:"18px 16px" }}>
            <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:16 }}>
              <button onClick={()=>setAktifEkran(oncekiEkran)} style={{ background:"none", border:"none", color:"#4fc3f7", cursor:"pointer", fontSize:12, padding:0, fontFamily:"monospace" }}>← Geri</button>
              <div style={{ marginLeft:"auto", display:"flex", gap:8 }}>
                <button onClick={()=>duzenlemeBaslat(secilenMit)} style={{ background:"rgba(79,195,247,0.1)", border:"1px solid rgba(79,195,247,0.2)", color:"#4fc3f7", borderRadius:7, padding:"5px 10px", fontSize:11, cursor:"pointer" }}>✏️ Düzenle</button>
                <button onClick={()=>setSilOnay(secilenMit.id)} style={{ background:"rgba(240,98,146,0.1)", border:"1px solid rgba(240,98,146,0.2)", color:"#f06292", borderRadius:7, padding:"5px 10px", fontSize:11, cursor:"pointer" }}>🗑️ Sil</button>
              </div>
            </div>
            <div style={{ fontSize:28, marginBottom:4 }}>{secilenMit.emoji}</div>
            <div style={{ fontSize:19, fontWeight:700, color:"#fff", marginBottom:4 }}>{secilenMit.baslik}</div>
            <div style={{ fontSize:10, color:"#7986a3", fontFamily:"monospace", marginBottom:18 }}>{secilenMit.kategori}</div>
            {[
              {renk:"#f06292",baslik:"🔴 WHAT IS THE NEUROMYTH?",icerik:secilenMit.mit},
              {renk:"#4fc3f7",baslik:"🔵 WHAT DOES SCIENCE SAY?",icerik:secilenMit.bilim},
              secilenMit.fenBaglantisi&&{renk:"#9c64f0",baslik:"🟣 IMPACT IN SCIENCE CLASS",icerik:secilenMit.fenBaglantisi},
              {renk:"#66bb6a",baslik:"🟢 EVIDENCE-BASED ALTERNATIVE",icerik:secilenMit.alternatif},
            ].filter(Boolean).map(b => (
              <div key={b.baslik} style={{ background:"rgba(255,255,255,0.02)", borderLeft:`3px solid ${b.renk}`, borderRadius:10, padding:13, marginBottom:10 }}>
                <div style={{ fontSize:10, color:b.renk, fontFamily:"monospace", letterSpacing:"0.5px", marginBottom:6 }}>{b.baslik}</div>
                <div style={{ fontSize:13, color:"#c5cee0", lineHeight:1.7 }}>{b.icerik}</div>
              </div>
            ))}
            {secilenMit.kaynaklar.length > 0 && (
              <div style={{ background:"rgba(255,255,255,0.02)", border:"1px solid rgba(255,255,255,0.05)", borderRadius:10, padding:13 }}>
                <div style={{ fontSize:10, color:"#7986a3", fontFamily:"monospace", marginBottom:8 }}>📖 BİLİMSEL KAYNAKLAR</div>
                {secilenMit.kaynaklar.map((k,i) => <div key={i} style={{ fontSize:12, color:"#9aa5be", lineHeight:1.6, paddingLeft:8, borderLeft:"1px solid rgba(255,255,255,0.08)", marginBottom:5 }}>{k}</div>)}
              </div>
            )}
          </div>
        )}

        {/* ── NÖROMİT EKLE/DÜZENLE ───────────────────────────────────── */}
        {aktifEkran === "mitEkle" && (
          <div style={{ padding:"18px 16px" }}>
            <div style={{ display:"flex", alignItems:"center", marginBottom:18 }}>
              <button onClick={()=>{setAktifEkran("kutuphane");setForm(BOŞ_FORM);setDuzenlemId(null);setFormHata({});}} style={{ background:"none", border:"none", color:"#4fc3f7", cursor:"pointer", fontSize:12, padding:0, fontFamily:"monospace" }}>← İptal</button>
              <div style={{ fontSize:15, fontWeight:700, color:"#fff", marginLeft:12 }}>{duzenlemId?"✏️ Edit Neuromyth":"➕ Add New Neuromyth"}</div>
            </div>
            <Alan label="EMOJI">
              <button onClick={()=>setEmojiSecici(!emojiSecici)} style={{ background:"rgba(255,255,255,0.05)", border:"1px solid rgba(255,255,255,0.1)", borderRadius:10, padding:"8px 16px", fontSize:22, cursor:"pointer" }}>{form.emoji}</button>
              {emojiSecici && (
                <div style={{ background:"#141826", border:"1px solid rgba(255,255,255,0.1)", borderRadius:12, padding:10, marginTop:8, display:"flex", flexWrap:"wrap", gap:4 }}>
                  {EMOJILER.map(e => <button key={e} onClick={()=>{formGuncelle("emoji",e);setEmojiSecici(false);}} style={{ background:form.emoji===e?"rgba(79,195,247,0.2)":"transparent", border:"none", borderRadius:8, padding:"6px 8px", fontSize:20, cursor:"pointer" }}>{e}</button>)}
                </div>
              )}
            </Alan>
            <Alan label="NEUROMYTH TITLE" zorunlu hata={formHata.baslik}>
              <input value={form.baslik} onChange={e=>formGuncelle("baslik",e.target.value)} placeholder="e.g. The 10% Brain Myth" style={inputStil(formHata.baslik)} />
            </Alan>
            <Alan label="CATEGORY" zorunlu hata={formHata.kategori}>
              <div style={{ display:"flex", flexWrap:"wrap", gap:6, marginBottom:8 }}>
                {mevcutKategoriler.map(k => (
                  <button key={k} onClick={()=>{formGuncelle("kategori",k);formGuncelle("yeniKategori","");}} style={{ padding:"5px 11px", borderRadius:16, border:"1px solid", borderColor:form.kategori===k&&!form.yeniKategori?"#4fc3f7":"rgba(255,255,255,0.1)", background:form.kategori===k&&!form.yeniKategori?"rgba(79,195,247,0.15)":"transparent", color:form.kategori===k&&!form.yeniKategori?"#4fc3f7":"#9aa5be", fontSize:12, cursor:"pointer" }}>{k}</button>
                ))}
              </div>
              <input value={form.yeniKategori} onChange={e=>{formGuncelle("yeniKategori",e.target.value);if(e.target.value)formGuncelle("kategori","");}} placeholder="Enter new category (optional)" style={inputStil(formHata.kategori&&!form.kategori&&!form.yeniKategori)} />
            </Alan>
            <Alan label="WHAT DOES THE NEUROMYTH CLAIM?" zorunlu hata={formHata.mit}>
              <textarea value={form.mit} onChange={e=>formGuncelle("mit",e.target.value)} placeholder="What does this neuromyth claim?" style={{...inputStil(formHata.mit),minHeight:75,resize:"vertical"}} />
            </Alan>
            <Alan label="WHAT DOES SCIENCE SAY?" zorunlu hata={formHata.bilim}>
              <textarea value={form.bilim} onChange={e=>formGuncelle("bilim",e.target.value)} placeholder="What do the research studies show?" style={{...inputStil(formHata.bilim),minHeight:75,resize:"vertical"}} />
            </Alan>
            <Alan label="HOW DOES IT APPEAR IN SCIENCE CLASS?">
              <textarea value={form.fenBaglantisi} onChange={e=>formGuncelle("fenBaglantisi",e.target.value)} placeholder="How is this myth used in science classes?" style={{...inputStil(false),minHeight:65,resize:"vertical"}} />
            </Alan>
            <Alan label="EVIDENCE-BASED ALTERNATIVE STRATEGY" zorunlu hata={formHata.alternatif}>
              <textarea value={form.alternatif} onChange={e=>formGuncelle("alternatif",e.target.value)} placeholder="What should be done instead?" style={{...inputStil(formHata.alternatif),minHeight:65,resize:"vertical"}} />
            </Alan>
            <Alan label="SCIENTIFIC SOURCES (one source per line)">
              <textarea value={form.kaynaklar} onChange={e=>formGuncelle("kaynaklar",e.target.value)} placeholder={"Yazar (Yıl). Makale adı. Dergi.\nYazar2 (Yıl). Kitap adı."} style={{...inputStil(false),minHeight:65,resize:"vertical",fontFamily:"monospace",fontSize:12}} />
            </Alan>
            <Alan label="KEYWORDS (comma-separated)" zorunlu hata={formHata.anahtar_kelimeler}>
              <input value={form.anahtar_kelimeler} onChange={e=>formGuncelle("anahtar_kelimeler",e.target.value)} placeholder="visual learner, auditory learner, learning style" style={inputStil(formHata.anahtar_kelimeler)} />
              <div style={{ fontSize:11, color:"#7986a3", marginTop:4 }}>Bu kelimeler ders planı analizinde kullanılır</div>
            </Alan>
            <button onClick={mitKaydet} style={{ width:"100%", marginTop:8, background:"linear-gradient(135deg,#4fc3f7,#9c64f0)", border:"none", borderRadius:12, padding:"14px", color:"#fff", fontSize:14, fontWeight:700, cursor:"pointer" }}>
              {duzenlemId?"✅ Update":"✅ Add to Library"}
            </button>
          </div>
        )}

        {/* ── ARAŞTIRMA EKLE/DÜZENLE (sadece yönetici) ───────────────── */}
        {aktifEkran === "arastirmaEkle" && (
          <div style={{ padding:"18px 16px" }}>
            <div style={{ display:"flex", alignItems:"center", marginBottom:18 }}>
              <button onClick={()=>{setAktifEkran("yonetici");setArastirmaForm(BOŞ_ARASTIRMA);setArastirmaDuzenlemId(null);setArastirmaFormHata({});}} style={{ background:"none", border:"none", color:"#4fc3f7", cursor:"pointer", fontSize:12, padding:0, fontFamily:"monospace" }}>← İptal</button>
              <div style={{ fontSize:15, fontWeight:700, color:"#fff", marginLeft:12 }}>{arastirmaDuzenlemId?"✏️ Edit Research":"🔬 Add New Research"}</div>
            </div>

            <Alan label="RESEARCH TITLE" zorunlu hata={arastirmaFormHata.baslik}>
              <input value={arastirmaForm.baslik} onChange={e=>arastirmaFormGuncelle("baslik",e.target.value)} placeholder="e.g. Prevalence of Neuromyths among Science Teachers" style={inputStil(arastirmaFormHata.baslik)} />
            </Alan>

            <Alan label="RESEARCH SUMMARY" zorunlu hata={arastirmaFormHata.ozet}>
              <textarea value={arastirmaForm.ozet} onChange={e=>arastirmaFormGuncelle("ozet",e.target.value)} placeholder="Key findings and significance of the research..." style={{...inputStil(arastirmaFormHata.ozet),minHeight:100,resize:"vertical"}} />
            </Alan>

            <Alan label="SOURCE (APA format)" zorunlu hata={arastirmaFormHata.kaynak}>
              <input value={arastirmaForm.kaynak} onChange={e=>arastirmaFormGuncelle("kaynak",e.target.value)} placeholder="Author, A. (2024). Article title. Journal, volume(issue), pages." style={inputStil(arastirmaFormHata.kaynak)} />
            </Alan>

            <div style={{ display:"flex", gap:10 }}>
              <div style={{ flex:1 }}>
                <Alan label="YEAR" zorunlu hata={arastirmaFormHata.yil}>
                  <input value={arastirmaForm.yil} onChange={e=>arastirmaFormGuncelle("yil",e.target.value)} placeholder="2024" style={inputStil(arastirmaFormHata.yil)} />
                </Alan>
              </div>
              <div style={{ flex:1 }}>
                <Alan label="LABEL">
                  <input value={arastirmaForm.etiket} onChange={e=>arastirmaFormGuncelle("etiket",e.target.value)} placeholder="UK / Meta-Analysis / RCT" style={inputStil(false)} />
                </Alan>
              </div>
            </div>

            <Alan label="COLOUR LABEL">
              <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
                {ARASTIRMA_RENKLERI.map(r => (
                  <button key={r} onClick={()=>arastirmaFormGuncelle("renk",r)}
                    style={{ width:32, height:32, borderRadius:"50%", background:r, border:arastirmaForm.renk===r?"3px solid #fff":"3px solid transparent", cursor:"pointer", outline:"none" }} />
                ))}
              </div>
            </Alan>

            <button onClick={arastirmaKaydet} style={{ width:"100%", marginTop:8, background:"linear-gradient(135deg,#4fc3f7,#9c64f0)", border:"none", borderRadius:12, padding:"14px", color:"#fff", fontSize:14, fontWeight:700, cursor:"pointer" }}>
              {arastirmaDuzenlemId?"✅ Update":"✅ Add Research"}
            </button>
          </div>
        )}

        {/* ── YÖNETİCİ PANELİ ────────────────────────────────────────── */}
        {aktifEkran === "yonetici" && (
          <div style={{ padding:"18px 16px" }}>
            <div style={{ fontSize:17, fontWeight:700, color:"#fff", marginBottom:4 }}>⚙️ Yönetici Paneli</div>
            <div style={{ fontSize:12, color:"#7986a3", marginBottom:18 }}>Kütüphane ve araştırmaları yönetin</div>

            {/* Nöromit bölümü */}
            <div style={{ fontSize:10, color:"#7986a3", fontFamily:"monospace", letterSpacing:"1px", marginBottom:10 }}>NÖROMİT KÜTÜPHANESİ</div>
            <button onClick={()=>{setForm(BOŞ_FORM);setDuzenlemId(null);setFormHata({});setAktifEkran("mitEkle");}}
              style={{ width:"100%", background:"rgba(79,195,247,0.08)", border:"1px solid rgba(79,195,247,0.2)", borderRadius:12, padding:"13px", color:"#4fc3f7", fontSize:13, fontWeight:600, cursor:"pointer", marginBottom:10, textAlign:"left" }}>
              ➕ Yeni Nöromit Ekle <span style={{ float:"right", opacity:0.6 }}>{mitler.length} kayıt</span>
            </button>

            {/* Araştırma bölümü */}
            <div style={{ fontSize:10, color:"#7986a3", fontFamily:"monospace", letterSpacing:"1px", marginBottom:10, marginTop:20 }}>GÜNCEL ARAŞTIRMALAR</div>
            <button onClick={()=>{setArastirmaForm(BOŞ_ARASTIRMA);setArastirmaDuzenlemId(null);setArastirmaFormHata({});setAktifEkran("arastirmaEkle");}}
              style={{ width:"100%", background:"rgba(156,100,240,0.08)", border:"1px solid rgba(156,100,240,0.2)", borderRadius:12, padding:"13px", color:"#9c64f0", fontSize:13, fontWeight:600, cursor:"pointer", marginBottom:10, textAlign:"left" }}>
              🔬 Yeni Araştırma Ekle <span style={{ float:"right", opacity:0.6 }}>{arastirmalar.length} kayıt</span>
            </button>

            <div style={{ background:"rgba(255,255,255,0.02)", border:"1px solid rgba(255,255,255,0.05)", borderRadius:13, padding:14 }}>
              <div style={{ fontSize:10, color:"#7986a3", fontFamily:"monospace", marginBottom:12 }}>MEVCUT ARAŞTIRMALAR</div>
              {arastirmalar.length === 0 ? (
                <div style={{ fontSize:12, color:"#7986a3", textAlign:"center", padding:"12px 0" }}>Henüz araştırma eklenmemiş</div>
              ) : (
                arastirmalar.map(a => (
                  <div key={a.id} style={{ display:"flex", alignItems:"center", gap:8, padding:"9px 0", borderBottom:"1px solid rgba(255,255,255,0.04)" }}>
                    <div style={{ width:8, height:8, borderRadius:"50%", background:a.renk, flexShrink:0 }} />
                    <div style={{ flex:1 }}>
                      <div style={{ fontSize:12, color:"#fff", fontWeight:600, lineHeight:1.3 }}>{a.baslik}</div>
                      <div style={{ fontSize:10, color:"#7986a3" }}>{a.yil} · {a.etiket}</div>
                    </div>
                    <button onClick={()=>arastirmaDuzenlemeBaslat(a)} style={{ background:"rgba(79,195,247,0.1)", border:"1px solid rgba(79,195,247,0.2)", color:"#4fc3f7", borderRadius:6, padding:"4px 8px", fontSize:11, cursor:"pointer" }}>✏️</button>
                    <button onClick={()=>setArasSilOnay(a.id)} style={{ background:"rgba(240,98,146,0.1)", border:"1px solid rgba(240,98,146,0.2)", color:"#f06292", borderRadius:6, padding:"4px 8px", fontSize:11, cursor:"pointer" }}>🗑️</button>
                  </div>
                ))
              )}
            </div>

            <div style={{ background:"rgba(255,165,0,0.05)", border:"1px solid rgba(255,165,0,0.18)", borderRadius:12, padding:13, marginTop:14 }}>
              <div style={{ fontSize:11, color:"#ffb74d", fontFamily:"monospace", marginBottom:5 }}>💡 NOT</div>
              <div style={{ fontSize:12, color:"#9aa5be", lineHeight:1.6 }}>Veriler yalnızca bu oturumda saklanıyor. Kalıcı kayıt için Firebase entegrasyonu önerilir.</div>
            </div>
          </div>
        )}

        {/* ── CHAT ────────────────────────────────────────────────────── */}
        {aktifEkran === "chat" && (
          <div style={{ padding:"18px 16px", display:"flex", flexDirection:"column", height:"calc(100vh - 160px)" }}>
            <div style={{ fontSize:17, fontWeight:700, color:"#fff", marginBottom:4 }}>💬 AI Asistan</div>
            <div style={{ fontSize:12, color:"#7986a3", marginBottom:14 }}>Nöromitler hakkında soru sorun</div>
            <div style={{ flex:1, overflowY:"auto", marginBottom:10, display:"flex", flexDirection:"column", gap:10 }}>
              {chatMesajlar.map((m,i) => (
                <div key={i} style={{ display:"flex", justifyContent:m.rol==="kullanici"?"flex-end":"flex-start" }}>
                  <div style={{ maxWidth:"85%", background:m.rol==="kullanici"?"rgba(79,195,247,0.15)":"rgba(255,255,255,0.04)", border:`1px solid ${m.rol==="kullanici"?"rgba(79,195,247,0.25)":"rgba(255,255,255,0.07)"}`, borderRadius:13, padding:"9px 13px", fontSize:13, color:"#e0e0e0", lineHeight:1.6 }}>
                    {m.icerik}
                  </div>
                </div>
              ))}
              {chatYukleniyor && (
                <div style={{ display:"flex", gap:4, padding:"9px 13px", background:"rgba(255,255,255,0.04)", borderRadius:13, width:"fit-content" }}>
                  {[0,1,2].map(i=><div key={i} style={{ width:5, height:5, borderRadius:"50%", background:"#4fc3f7", animation:"pulse 1s infinite", animationDelay:`${i*0.2}s` }} />)}
                </div>
              )}
              <div ref={chatSonRef} />
            </div>
            <div style={{ display:"flex", gap:8 }}>
              <input value={chatGirdi} onChange={e=>setChatGirdi(e.target.value)} onKeyDown={e=>e.key==="Enter"&&chatGonder()} placeholder="Type your question..." style={{ flex:1, ...inputStil(false) }} />
              <button onClick={chatGonder} disabled={chatYukleniyor||!chatGirdi.trim()} style={{ background:"linear-gradient(135deg,#4fc3f7,#9c64f0)", border:"none", borderRadius:11, width:44, cursor:"pointer", fontSize:16, opacity:chatYukleniyor?0.5:1 }}>→</button>
            </div>
          </div>
        )}
      </div>

      {/* ALT NAVİGASYON */}
      <div style={{ position:"fixed", bottom:0, left:"50%", transform:"translateX(-50%)", width:"100%", maxWidth:430, background:"rgba(10,14,26,0.96)", backdropFilter:"blur(20px)", borderTop:"1px solid rgba(255,255,255,0.07)", display:"flex", zIndex:100 }}>
        {[
          {id:"ana",ikon:"⊞",etiket:"Home"},
          {id:"analiz",ikon:"⌖",etiket:"Analysis"},
          {id:"kutuphane",ikon:"◫",etiket:"Library"},
          {id:"arastirmalar",ikon:"🔬",etiket:"Research"},
          {id:"chat",ikon:"◉",etiket:"Assistant"},
          {id:"yonetici",ikon:"⚙",etiket:"Admin"},
        ].map(tab => (
          <button key={tab.id} onClick={()=>setAktifEkran(tab.id)}
            style={{ flex:1, background:"none", border:"none", padding:"10px 2px 8px", cursor:"pointer", display:"flex", flexDirection:"column", alignItems:"center", gap:2 }}>
            <span style={{ fontSize:tab.id==="arastirmalar"?14:16, color:aktifEkran===tab.id?"#4fc3f7":"#fff", opacity:aktifEkran===tab.id?1:0.35 }}>{tab.ikon}</span>
            <span style={{ fontSize:8, color:aktifEkran===tab.id?"#4fc3f7":"#7986a3", fontFamily:"monospace" }}>{tab.etiket}</span>
          </button>
        ))}
      </div>

      <style>{`
        @keyframes pulse{0%,100%{opacity:0.3;transform:scale(0.8)}50%{opacity:1;transform:scale(1.1)}}
        button:active{transform:scale(0.97)}
        ::-webkit-scrollbar{width:3px}
        ::-webkit-scrollbar-thumb{background:rgba(79,195,247,0.2);border-radius:2px}
        textarea:focus,input:focus{border-color:rgba(79,195,247,0.4)!important;box-shadow:0 0 0 3px rgba(79,195,247,0.07)}
      `}</style>
    </div>
  );
}
